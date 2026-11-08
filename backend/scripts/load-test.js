const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const autocannon = require('autocannon');
const mongoose = require('mongoose');

// Ensure rate limiting is bypassed during load benchmarking
process.env.DISABLE_RATE_LIMIT = 'true';
process.env.ENABLE_TRENDING_CACHE = 'true';
process.env.NODE_ENV = 'test';

let serverInstance = null;
let mongoServer = null;

async function startEphemeralServer(port = 4001) {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  // Seed sample post data for query realistic benchmarking
  const Post = require('../models/post.model');
  const User = require('../models/user.model');
  const View = require('../models/view.model');
  const Read = require('../models/read.model');

  const testUser = await User.create({
    username: 'loadtester',
    email: 'tester@bloghub.com',
    password: 'Password123!',
  });

  const samplePosts = Array.from({ length: 20 }, (_, i) => ({
    title: `Benchmark Story ${i + 1}`,
    slug: `benchmark-story-${i + 1}`,
    content: `# Benchmark Story ${i + 1}\n\nHigh-concurrency read test content payload with Benchmark keywords.`,
    user: testUser._id,
    visibility: 'public',
  }));
  const createdPosts = await Post.insertMany(samplePosts);

  // Seed views and reads so MIN_VIEWS = 3 is met for trending
  const viewDocs = [];
  const readDocs = [];
  createdPosts.forEach((post) => {
    for (let v = 0; v < 10; v++) {
      viewDocs.push({ post: post._id, visitorKey: `v:${post._id}:${v}` });
    }
    for (let r = 0; r < 5; r++) {
      readDocs.push({ post: post._id, visitorKey: `r:${post._id}:${r}` });
    }
  });
  await View.insertMany(viewDocs);
  await Read.insertMany(readDocs);

  const app = require('../index');
  return new Promise((resolve) => {
    serverInstance = app.listen(port, () => {
      resolve(`http://localhost:${port}`);
    });
  });
}

async function runScenario({ title, url, connections = 50, duration = 5 }) {
  console.log(`\n======================================================`);
  console.log(`🚀 SCENARIO: ${title}`);
  console.log(`   Target:      ${url}`);
  console.log(`   Concurrency: ${connections} connections`);
  console.log(`   Duration:    ${duration} seconds`);
  console.log(`======================================================`);

  return new Promise((resolve, reject) => {
    autocannon(
      {
        url,
        connections,
        duration,
        pipelining: 1,
      },
      (err, result) => {
        if (err) return reject(err);
        autocannon.printResult(result);
        resolve(result);
      },
    );
  });
}

async function main() {
  let targetUrl = process.env.LOAD_TEST_URL;

  if (targetUrl) {
    console.log(`[LoadTest] Testing target server at ${targetUrl}`);
  } else {
    console.log(`[LoadTest] Launching isolated ephemeral benchmark server...`);
    targetUrl = await startEphemeralServer(4001);
    console.log(`[LoadTest] Ephemeral benchmark server running at ${targetUrl}`);
  }

  const results = [];
  try {
    // 1. Health baseline
    results.push(
      await runScenario({
        title: 'Event Loop Baseline (/api/health)',
        url: `${targetUrl}/api/health`,
        connections: 50,
        duration: 5,
      }),
    );

    // 2. Database Read / Trending Aggregation
    results.push(
      await runScenario({
        title: 'Database Read - Trending Posts (/api/posts/trending)',
        url: `${targetUrl}/api/posts/trending`,
        connections: 50,
        duration: 5,
      }),
    );

    // 3. Database Search Query
    results.push(
      await runScenario({
        title: 'Database Search Query (/api/search/Benchmark)',
        url: `${targetUrl}/api/search/Benchmark`,
        connections: 50,
        duration: 5,
      }),
    );

    console.log(`\n======================================================`);
    console.log(`📊 LOAD TEST PERFORMANCE SUMMARY`);
    console.log(`======================================================`);

    let anyFailed = false;
    results.forEach((res, index) => {
      const scenarioName = index === 0 ? 'Health' : index === 1 ? 'Trending' : 'Search';
      const rps = res.requests.average;
      const p95 = res.latency.p97_5 || res.latency.p99 || res.latency.average;
      const errors = res.errors + res.timeouts + res.non2xx;

      const p95Passed = p95 <= 200;
      const errorsPassed = errors === 0;
      const status = p95Passed && errorsPassed ? '✅ PASS' : '❌ FAIL';

      if (!p95Passed || !errorsPassed) anyFailed = true;

      console.log(
        `${scenarioName.padEnd(12)} | Req/sec: ${String(Math.round(rps)).padStart(6)} | p95 Latency: ${String(p95).padStart(5)} ms | Errors: ${errors} | ${status}`,
      );
    });
    console.log(`======================================================\n`);

    if (anyFailed) {
      console.error(
        '[LoadTest] ❌ One or more scenarios breached performance budgets (p95 <= 200ms, 0 errors).',
      );
      process.exitCode = 1;
    } else {
      console.log('[LoadTest] ✅ All backend endpoints passed throughput and latency budgets!');
    }
  } finally {
    if (serverInstance) {
      console.log('[LoadTest] Tearing down ephemeral test server...');
      await new Promise((resolve) => {
        serverInstance.close(resolve);
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
      await mongoose.disconnect();
      if (mongoServer) await mongoServer.stop();
    }
  }
}

main().catch((err) => {
  console.error('[LoadTest] Unexpected error:', err);
  process.exit(1);
});
