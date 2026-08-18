const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const User = require('./models/user.model');
const Post = require('./models/post.model');
const Tag = require('./models/tag.model');
const Category = require('./models/category.model');
const Comment = require('./models/comment.model');
const Like = require('./models/like.model');
const Profile = require('./models/user-profile.model');
const View = require('./models/view.model');
const Read = require('./models/read.model');
const Analytics = require('./models/analytics.model');

const { connectDB } = require('./config/db');

// All 10 Multi-Categories
const categories = [
  'Technology',
  'Design',
  'Business',
  'Lifestyle',
  'Science',
  'Travel',
  'Programming',
  'Health',
  'Food',
  'Photography',
];

const users = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    bio: 'Full-stack engineer & culinary explorer. Writing about React, Edge systems, Sourdough science, and clean architecture.',
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    bio: 'Lead UX Designer crafting human-centered systems. Exploring micro-interactions, typography, and design tokens.',
  },
  {
    username: 'mike_wilson',
    email: 'mike@example.com',
    password: 'password123',
    bio: 'DevOps lead & cloud architect. Automating distributed Kubernetes clusters and building resilient infrastructure.',
  },
  {
    username: 'sarah_jones',
    email: 'sarah@example.com',
    password: 'password123',
    bio: 'Frontend architect specializing in Vue 3, TypeScript, and modern fluid CSS layout systems.',
  },
  {
    username: 'alex_brown',
    email: 'alex@example.com',
    password: 'password123',
    bio: 'Startup founder & mobile engineer. Sharing lessons on early-stage traction, product strategy, and React Native.',
  },
  {
    username: 'emily_davis',
    email: 'emily@example.com',
    password: 'password123',
    bio: 'Data scientist & deep learning researcher. Demystifying neural networks, Python workflows, and cosmic datasets.',
  },
  {
    username: 'chris_taylor',
    email: 'chris@example.com',
    password: 'password123',
    bio: 'Backend systems engineer with expertise in Go, high-throughput queues, and distributed databases.',
  },
  {
    username: 'lisa_anderson',
    email: 'lisa@example.com',
    password: 'password123',
    bio: 'Product strategist and agile coach. Exploring team dynamics, asynchronous workflows, and sustainable growth.',
  },
  {
    username: 'david_martin',
    email: 'david@example.com',
    password: 'password123',
    bio: 'Security researcher & white-hat ethical hacker. Keeping web applications safe against modern exploit vectors.',
  },
  {
    username: 'emma_white',
    email: 'emma@example.com',
    password: 'password123',
    bio: 'Technical author and storytelling advocate. Making complex computer science topics accessible and engaging.',
  },
  {
    username: 'james_lee',
    email: 'james@example.com',
    password: 'password123',
    bio: 'AI researcher working on transformer architectures, attention mechanisms, and multilingual tokenizers.',
  },
  {
    username: 'olivia_chen',
    email: 'olivia@example.com',
    password: 'password123',
    bio: 'Web3 developer, digital nomad, and photographer. Writing about remote life, smart contracts, and travel.',
  },
  {
    username: 'ryan_garcia',
    email: 'ryan@example.com',
    password: 'password123',
    bio: 'Graphics programmer and game designer. Crafting shaders, procedural generation, and immersive interactive worlds.',
  },
  {
    username: 'sophia_kim',
    email: 'sophia@example.com',
    password: 'password123',
    bio: 'Cloud solutions architect. Designing multi-region serverless architectures for global consumer applications.',
  },
  {
    username: 'admin',
    email: 'admin@bloghub.com',
    password: 'admin123',
    bio: 'BlogHub Administrator and Platform Curator.',
    roles: ['user', 'admin'],
  },
];

// Rich Pool of Multi-Category Stories
const storiesPool = [
  // Technology & Cloud
  {
    title: 'Getting Started with React 18: A Complete Guide to Concurrent Rendering',
    slug: 'getting-started-react-18-guide',
    content: `# Introduction to React 18\n\nReact 18 brings exciting new capabilities that improve both runtime performance and developer experience. In this comprehensive guide, we explore the key architectural changes.\n\n## Concurrent Rendering\n\nOne of the most significant additions is concurrent rendering, which allows React to prepare multiple versions of the UI in memory before committing changes to the DOM.\n\n## Automatic Batching\n\nReact 18 automatically batches state updates, even inside asynchronous promises, timeouts, and native event handlers. This drastically reduces unnecessary component re-renders.\n\n> The future of UI engineering is concurrent, and React 18 sets a high bar for responsive interfaces.\n\nStart experimenting with these features in your apps today!`,
    imageURL: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category: 'Technology',
  },
  {
    title: 'Architecting Next-Gen Edge Systems: From Monolith to Distributed Workers',
    slug: 'architecting-next-gen-edge-systems',
    content: `# The Shift to the Edge\n\nModern web applications demand single-digit millisecond latency worldwide. Moving computation from centralized data centers to edge locations is no longer optional.\n\n## Edge Compute Mechanics\n\nBy executing lightweight V8 isolates close to visitors, edge workers reduce round-trip times by up to 80% compared to traditional origin servers.\n\n## Stateful vs Stateless at the Edge\n\nCombining serverless edge logic with globally distributed key-value stores unlocks real-time personalization without database bottlenecks.`,
    imageURL: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    category: 'Technology',
  },
  {
    title: 'Docker for Developers: Practical Multi-Stage Containerization',
    slug: 'docker-developers-practical-guide',
    content: `# Why Containers Matter\n\nDocker eliminates "it works on my machine" inconsistencies by bundling applications with their runtime dependencies.\n\n## Multi-Stage Builds\n\nUsing multi-stage Dockerfiles keeps production container images minimal, secure, and fast to deploy across Kubernetes clusters.`,
    imageURL: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800',
    category: 'Technology',
  },
  {
    title: 'The Future of Web Development: AI, Edge, and Web Components',
    slug: 'future-web-development-trends',
    content: `# Evolving the Web Platform\n\nThe web continues to evolve rapidly. From AI-assisted coding tools to standard Web Components, developers now have unprecedented leverage to build fluid, cross-framework digital experiences.`,
    imageURL: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    category: 'Technology',
  },

  // Food & Culinary Science
  {
    title: 'The Chemistry of Sourdough: Why Temperature and Hydration Rule the Crumb',
    slug: 'chemistry-of-sourdough-crumb',
    content: `# The Science of Wild Fermentation\n\nSourdough baking is equal parts culinary art and microbiological precision. When wild yeasts and lactic acid bacteria ferment flour and water, they create complex organic acids that give the bread its signature tang and open, airy crumb structure.\n\n## The Role of Hydration\n\nA 75% hydration dough allows gluten to stretch without tearing during bulk fermentation. Combined with gentle stretch-and-folds every 30 minutes, you develop a strong gluten matrix capable of trapping CO2 during the oven spring.\n\n## Temperature as an Ingredient\n\nFermenting at 26°C (78°F) favors lactic acid production, delivering a smooth yogurt-like flavor, whereas lower temperatures (18°C) encourage acetic acid, creating a sharper, vinegary punch.`,
    imageURL: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800',
    category: 'Food',
  },
  {
    title: 'Artisanal Pasta from Scratch: The Geometry of Flour, Eggs, and Bronze Dies',
    slug: 'artisanal-pasta-geometry-flour-eggs',
    content: `# The Architecture of Fresh Pasta\n\nMaking pasta by hand is a sensory masterclass in gluten formation. The ratio of egg yolks to whole eggs dictates both elasticity and golden richness.\n\n## Semolina vs Type 00 Flour\n\n- **Semolina (Durum Wheat):** High protein and rough texture, ideal for extruded shapes like rigatoni that cling to heavy sauces.\n- **Type 00 Flour:** Finely ground soft wheat, yielding delicate, silky sheets perfect for filled tortellini and tagliatelle.\n\nRespect the dough, knead with intention, and let it rest!`,
    imageURL: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
    category: 'Food',
  },
  {
    title: 'Quick Healthy Meals for Busy Creators: High-Energy Nutrition',
    slug: 'quick-healthy-meals-busy-creators',
    content: `# Fueling Your Focus\n\nLong hours creating or coding require sustained blood sugar without post-lunch crashes. Here are simple 15-minute meal frameworks using whole grains, lean proteins, and fermented foods.`,
    imageURL: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    category: 'Food',
  },
  {
    title: 'The Alchemy of Specialty Coffee: Extraction Ratios and Grind Distribution',
    slug: 'alchemy-of-specialty-coffee-extraction',
    content: `# Precision in the Cup\n\nFrom burr geometry to total dissolved solids (TDS), brewing exceptional pour-over coffee is an exercise in thermodynamic extraction. Discover how water mineral composition shapes acidity and body.`,
    imageURL: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    category: 'Food',
  },

  // Design & UI/UX
  {
    title: 'Crafting Interfaces That Feel Alive: The Philosophy of Micro-Interactions',
    slug: 'crafting-fluid-micro-interactions',
    content: `# Fluid Physics in Digital Design\n\nGreat design is rarely about flashy visual fireworks; it is about the quiet delight of responsive physics. When an interface reacts with natural easing curves, spring physics, and purposeful tactile feedback, software feels less like cold pixels and more like a crafted physical instrument.\n\n## Rules for Delightful Interactions\n\n- Respect reduced motion preferences unconditionally.\n- Keep transition durations between 150ms and 240ms.\n- Use natural cubic-bezier curves rather than linear mechanical timing.`,
    imageURL: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800',
    category: 'Design',
  },
  {
    title: 'Modern CSS Techniques: Container Queries, Subgrid, and Cascade Layers',
    slug: 'modern-css-techniques-subgrid-layers',
    content: `# CSS Has Evolved\n\nModern CSS provides native primitives that replace bulky JavaScript workarounds. Container queries let components adapt to their immediate parent card rather than the global viewport width.`,
    imageURL: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
    category: 'Design',
  },
  {
    title: 'Color Theory for Digital Designers: Contrast, Emotion, and Accessibility',
    slug: 'color-theory-digital-designers-contrast',
    content: `# The Psychology of Color\n\nColors evoke trust, focus, and urgency. Learn how to build accessible palette tokens with automated WCAG AAA contrast compliance across both light and dark themes.`,
    imageURL: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800',
    category: 'Design',
  },
  {
    title: 'UI Design Principles: Visual Hierarchy, Spacing Scales, and Typography',
    slug: 'ui-design-principles-hierarchy-spacing',
    content: `# Designing for Clarity\n\nGreat typography and predictable 4px/8px spacing systems establish an intuitive reading cadence that keeps visitors engaged from the headline down to the closing thoughts.`,
    imageURL: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    category: 'Design',
  },

  // Science & Cosmos
  {
    title: 'Beyond the Event Horizon: What James Webb Reveals About Cosmic Dawn',
    slug: 'beyond-event-horizon-james-webb',
    content: `# Unveiling the Primordial Universe\n\nDeep-field infrared imagery from the James Webb Space Telescope (JWST) has challenged foundational assumptions in cosmology. Galaxies formed merely 350 million years after the Big Bang appear far more massive, structured, and luminous than classical stellar models predicted.\n\n## The Mystery of Early Black Holes\n\nSpectroscopic analysis of redshift galaxies reveals early metallicity and rapid black hole seeding, suggesting stellar nurseries ignited with unprecedented velocity in the cosmic dawn.`,
    imageURL: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
    category: 'Science',
  },
  {
    title: 'Understanding Neural Networks and Deep Learning Architecture',
    slug: 'understanding-neural-networks-architecture',
    content: `# From Perceptrons to Transformers\n\nNeural networks learn representations through backpropagation and gradient descent. We break down weight initialization, activation functions, and multi-head self-attention mechanisms.`,
    imageURL: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800',
    category: 'Science',
  },
  {
    title: 'The Quantum Computing Revolution: Qubits, Superposition, and Cryptography',
    slug: 'quantum-computing-revolution-qubits',
    content: `# The Next Frontier of Computation\n\nBy leveraging quantum superposition and entanglement, quantum computers solve polynomial factorization and molecular simulation problems that would take classical supercomputers millennia.`,
    imageURL: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    category: 'Science',
  },

  // Travel & Culture
  {
    title: 'Lost in the Alleys of Kyoto: A Journey Through Ancient Tea Culture',
    slug: 'lost-in-kyoto-ancient-tea-culture',
    content: `# The Art of Omotenashi\n\nIn the quiet residential pockets behind Gion, century-old machiya townhouses preserve centuries of ceremonial Uji matcha preparation. Here, the ritual of tea is an exercise in mindfulness, seasonal awareness, and hospitality.\n\nWalking past cedar lanterns in the mist of early morning, you realize that traditional craftsmanship is not just surviving in modern Japan—it is quietly thriving.`,
    imageURL: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    category: 'Travel',
  },
  {
    title: 'Digital Nomad Guide: Working from Anywhere with Focus and Routine',
    slug: 'digital-nomad-guide-work-anywhere',
    content: `# The World as Your Studio\n\nBalancing travel with consistent client delivery requires intentional daily routines, ergonomic gear, reliable coworking hubs, and asynchronous team communication.`,
    imageURL: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    category: 'Travel',
  },
  {
    title: 'Top Emerging Global Tech & Creative Hubs for 2025',
    slug: 'top-emerging-global-tech-hubs',
    content: `# Beyond Silicon Valley\n\nFrom Lisbon to Tokyo and Bengaluru to Austin, vibrant creative ecosystems are drawing global talent with high quality of life and booming startup networks.`,
    imageURL: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
    category: 'Travel',
  },

  // Health & Mind
  {
    title: 'The Science of Deep Sleep: Circadian Rhythms and Cognitive Recovery',
    slug: 'science-of-deep-sleep-recovery',
    content: `# Biological Foundations of Rest\n\nSlow-wave sleep and REM cycles are the biological foundation of memory consolidation, neural waste clearance via the glymphatic system, and emotional resilience.\n\n## Optimizing Circadian Rhythms\n\n1. **Morning Sunlight:** Get 10–15 minutes of direct morning sunlight to anchor cortisol timing.\n2. **Temperature Drop:** The core body temperature must drop ~1°C to initiate deep sleep.\n3. **Caffeine Half-Life:** Cut caffeine intake at least 9 hours before bedtime.`,
    imageURL: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=800',
    category: 'Health',
  },
  {
    title: 'Mental Health in High-Pace Teams: Breaking Burnout Cycles',
    slug: 'mental-health-high-pace-teams',
    content: `# Sustainable High Performance\n\nTrue high performance requires structured recovery. Normalize asynchronous communication, enforce real offline weekends, and celebrate sustainable workflows over overtime firefighting.`,
    imageURL: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800',
    category: 'Health',
  },
  {
    title: 'Ergonomics for Engineers: Desk Setup, Posture, and Eye Health',
    slug: 'ergonomics-for-engineers-desk-setup',
    content: `# Protecting Your Physical Asset\n\nPrevent repetitive strain injuries (RSI) with monitor arm alignment, split mechanical keyboards, dynamic standing intervals, and 20-20-20 visual rest rules.`,
    imageURL: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    category: 'Health',
  },

  // Programming & Architecture
  {
    title: 'The Art of Clean Code: Maintainable Patterns in TypeScript',
    slug: 'art-of-clean-code-typescript',
    content: `# Readability is King\n\nCode is read 10x more often than it is written. We explore self-documenting functions, immutability patterns, domain-driven design, and effective unit testing strategies.`,
    imageURL: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    category: 'Programming',
  },
  {
    title: 'Building High-Throughput REST & GraphQL APIs with Node.js',
    slug: 'building-high-throughput-apis-nodejs',
    content: `# Engineering Resilient Backends\n\nFrom connection pooling and Redis cache layers to centralized rate limiting and structured Pino logging, learn how to prepare Node.js APIs for millions of monthly requests.`,
    imageURL: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    category: 'Programming',
  },
  {
    title: 'Database Schema Design: SQL Normalization vs NoSQL Flexibility',
    slug: 'database-schema-design-sql-nosql',
    content: `# Storage Patterns for Modern Applications\n\nUnderstand when relational ACID guarantees outperform document stores, and how to structure compound indexes for single-digit millisecond query execution.`,
    imageURL: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
    category: 'Programming',
  },

  // Business & Startups
  {
    title: 'Building a Bootstrapped SaaS: 10 Lessons from 0 to 10k ARR',
    slug: 'bootstrapped-saas-lessons-0-to-10k',
    content: `# The Bootstrapper Journey\n\nFall in love with customer problems, not your initial solution. Learn how building in public and launching early creates compounding product feedback loops.`,
    imageURL: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
    category: 'Business',
  },
  {
    title: 'Leading Asynchronous Engineering Teams: Culture, Trust, and Rituals',
    slug: 'leading-async-engineering-teams',
    content: `# Autonomous Collaboration\n\nReplace calendar-choking meetings with well-written RFCs, recorded walkthroughs, and clear sprint ownership. Empower engineers to do their best deep work.`,
    imageURL: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
    category: 'Business',
  },

  // Photography & Visuals
  {
    title: 'Smartphone Photography: Composition, Natural Light, and Storytelling',
    slug: 'smartphone-photography-composition-light',
    content: `# Evocative Mobile Photography\n\nYou do not need a massive camera rig to capture unforgettable frames. Master leading lines, golden hour directional lighting, and subtle shadow grading on your phone.`,
    imageURL: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
    category: 'Photography',
  },
  {
    title: 'Street Photography in Motion: Capturing Spontaneous City Life',
    slug: 'street-photography-spontaneous-city-life',
    content: `# The Decisive Moment\n\nAnticipate human movement, observe interplay between neon reflections and shadows, and document the heartbeat of urban streets with respect and curiosity.`,
    imageURL: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800',
    category: 'Photography',
  },
];

const comments = [
  'Great article! This really helped me understand the nuance behind this concept.',
  'Thanks for sharing! I bookmarked this for our team weekly sync.',
  'Excellent breakdown. The visual examples made the mental model click immediately.',
  'This is exactly what I was searching for. Extremely well written!',
  'Bookmarked for future reference. Super insightful perspective!',
  'Could you write a follow-up post expanding on this architecture?',
  'I implemented this technique in my workflow today and saw immediate improvements.',
  'Clear, concise, and beautifully structured. Thank you for this guide!',
  'This changed my perspective completely. Looking forward to your next story.',
  'One of the best in-depth articles I have read on BlogHub this month.',
];

function randomDate(daysAgo = 60) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return date;
}

/**
 * Refuses to wipe anything that does not look like a local development database.
 *
 * The first thing seed() does is deleteMany({}) across nine collections. Against a local
 * database that is the point; against the deployment's it destroys every real account, story
 * and comment, with no undo. One mistyped MONGO_DB_URI is all that stands between those two
 * outcomes, so the remote case has to be asked for explicitly.
 */
function assertSafeTarget() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_DB_URI || process.env.DB_URI || '';
  const isLocal = /(localhost|127\.0\.0\.1)/.test(uri);

  if (isLocal) return;

  if (process.env.SEED_ALLOW_REMOTE !== 'yes') {
    console.error(
      [
        '',
        '  Refusing to seed a non-local database.',
        '',
        `  Target: ${uri.replace(/\/\/[^@]*@/, '//<credentials>@') || '(none set)'}`,
        '',
        '  Seeding DELETES every user, post, category, comment, like, profile, view,',
        '  read and analytics document before inserting the sample data. On a deployed',
        '  database that means every real account and everything written on it.',
        '',
        '  If that is genuinely what you want, re-run with:',
        '    SEED_ALLOW_REMOTE=yes npm run seed',
        '',
      ].join('\n'),
    );
    process.exit(1);
  }

  console.warn('[seed] SEED_ALLOW_REMOTE=yes — wiping a REMOTE database in 5 seconds…');
}

async function seed() {
  try {
    assertSafeTarget();

    await connectDB();
    console.log('Connected to database');

    // A last pause on a remote target, so a mistake can still be interrupted.
    if (process.env.SEED_ALLOW_REMOTE === 'yes') {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Tag.deleteMany({}),
      Category.deleteMany({}),
      Comment.deleteMany({}),
      Like.deleteMany({}),
      Profile.deleteMany({}),
      View.deleteMany({}),
      Read.deleteMany({}),
      Analytics.deleteMany({}),
    ]);

    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(
      categories.map((name) => ({ name, posts: [] })),
    );
    const categoryMap = {};
    createdCategories.forEach((cat) => (categoryMap[cat.name] = cat));
    console.log(`Created ${createdCategories.length} categories`);

    // Dynamic Tag Dictionary
    const tagMap = new Map();
    const getOrCreateTag = async (tagName) => {
      const clean = tagName.trim().toLowerCase();
      if (tagMap.has(clean)) return tagMap.get(clean);
      const tag = await Tag.create({ name: clean, posts: [] });
      tagMap.set(clean, tag);
      return tag;
    };

    console.log('Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        roles: userData.roles || ['user'],
        posts: [],
        createdAt: randomDate(90),
      });
      await user.save();

      const profile = new Profile({
        user: user._id,
        bio: userData.bio,
        followings: [],
        followers: [],
        postCount: 0,
        followingsCount: 0,
        followersCount: 0,
      });
      await profile.save();

      user.profile = profile._id;
      await user.save();
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users`);

    // ── Generate 6 to 8 Posts PER User ──────────────────────────────────────
    console.log('Generating 6 to 8 multi-topic stories per creator...');
    const createdPosts = [];
    const regularUsers = createdUsers.filter((u) => u.email !== 'admin@bloghub.com');

    // Topic tag mappings for rich tag discovery
    const categoryToTags = {
      Technology: ['technology', 'webdev', 'cloud', 'architecture'],
      Food: ['food', 'cooking', 'culinary', 'science'],
      Design: ['design', 'uiux', 'typography', 'creative'],
      Science: ['science', 'physics', 'space', 'research'],
      Travel: ['travel', 'adventure', 'nomad', 'culture'],
      Health: ['health', 'wellness', 'sleep', 'productivity'],
      Programming: ['programming', 'typescript', 'react', 'nodejs'],
      Business: ['business', 'startups', 'saas', 'leadership'],
      Photography: ['photography', 'visuals', 'art', 'camera'],
      Lifestyle: ['lifestyle', 'mindset', 'habits', 'books'],
    };

    for (let uIdx = 0; uIdx < regularUsers.length; uIdx++) {
      const user = regularUsers[uIdx];
      // Every user gets between 6 and 8 posts (average 7)
      const numPostsForUser = uIdx % 3 === 0 ? 8 : uIdx % 3 === 1 ? 7 : 6;

      for (let pIdx = 0; pIdx < numPostsForUser; pIdx++) {
        // Pick a base story from pool and customize slug/title uniqueness
        const templateIndex = (uIdx * 4 + pIdx) % storiesPool.length;
        const template = storiesPool[templateIndex];

        // 1 Draft, 1 Private, rest Public
        const visibility =
          pIdx === 0 && numPostsForUser >= 7
            ? 'draft'
            : pIdx === 1 && numPostsForUser >= 8
              ? 'private'
              : 'public';

        const categoryName = template.category;
        const category = categoryMap[categoryName] || createdCategories[0];
        const uniqueSlug = `${template.slug}-${user.username}-${pIdx + 1}`;

        // Resolve tag objects for this story
        const tagNames = categoryToTags[categoryName] || ['general', 'stories'];
        const tagObjects = await Promise.all(tagNames.map((name) => getOrCreateTag(name)));
        const tagIds = tagObjects.map((t) => t._id);

        const post = new Post({
          user: user._id,
          title: template.title,
          slug: uniqueSlug,
          content: template.content,
          imageURL: template.imageURL,
          visibility,
          categories: [category._id],
          tags: tagIds,
          likes: [],
          comments: [],
          views: [],
          createdAt: randomDate(60),
        });
        await post.save();

        user.posts.push(post._id);
        if (visibility === 'public') {
          await Profile.findOneAndUpdate({ user: user._id }, { $inc: { postCount: 1 } });
          category.posts.push(post._id);
          await category.save();

          // Sync tag backrefs
          for (const tagObj of tagObjects) {
            tagObj.posts.push(post._id);
            await tagObj.save();
          }
        }

        createdPosts.push(post);
      }
      await user.save();
    }
    console.log(
      `Created ${createdPosts.length} total posts across ${regularUsers.length} creators with ${tagMap.size} unique dynamic tags!`,
    );

    // Add comments to public posts
    console.log('Adding comments...');
    let commentCount = 0;
    const publicPosts = createdPosts.filter((p) => p.visibility === 'public');

    for (const post of publicPosts) {
      const numComments = Math.floor(Math.random() * 5) + 2;
      for (let i = 0; i < numComments; i++) {
        const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
        const randomComment = comments[Math.floor(Math.random() * comments.length)];

        const comment = new Comment({
          user: randomUser._id,
          // The back-reference, without which the comment is reachable only by walking
          // `post.comments`. Every post-scoped query — listing a story's responses, counting
          // them, deleting them with their post — matches on this field, so seeded comments
          // were invisible to all of them.
          post: post._id,
          message: randomComment,
          likes: [],
          dislikes: [],
          replies: [],
          replyCount: 0,
          date: new Date(post.createdAt.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000),
        });
        await comment.save();
        post.comments.push(comment._id);
        commentCount++;
      }
      await post.save();
    }
    console.log(`Added ${commentCount} comments`);

    // Add likes to public posts
    console.log('Adding likes...');
    let likeCount = 0;
    for (const post of publicPosts) {
      const numLikes = Math.floor(Math.random() * 8) + 2;
      const likers = new Set();
      while (likers.size < numLikes) {
        likers.add(String(regularUsers[Math.floor(Math.random() * regularUsers.length)]._id));
      }

      for (const likerId of likers) {
        const like = new Like({ user: likerId, post: post._id });
        await like.save();
        post.likes.push(like._id);
        likeCount++;
      }
      await post.save();
    }
    console.log(`Added ${likeCount} likes`);

    // Add views and reads
    console.log('Adding views, completed reads and analytics...');
    let viewCount = 0;
    let readCount = 0;

    for (const post of publicPosts) {
      const numViews = Math.floor(Math.random() * 40) + 15;
      const viewers = [];

      for (let i = 0; i < numViews; i++) {
        const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
        const view = new View({ user: randomUser._id, post: post._id });
        await view.save();
        post.views.push(view._id);
        viewers.push(randomUser._id);
        viewCount++;
      }

      const readThrough = 0.25 + Math.random() * 0.55;
      const finishers = new Set(
        viewers.slice(0, Math.round(viewers.length * readThrough)).map(String),
      );

      for (const userId of finishers) {
        await new Read({ user: userId, post: post._id }).save();
        readCount++;
      }

      await post.save();

      // Create Analytics Document for post
      const analytics = new Analytics({
        blogPost: post._id,
        totalPageViews: post.views.length + Math.floor(Math.random() * 50),
        totalLikes: post.likes.length,
        totalComments: post.comments.length,
      });
      await analytics.save();
    }
    console.log(`Added ${viewCount} views and ${readCount} completed reads with real analytics!`);

    // Add followers
    console.log('Adding follower relationships...');
    let followerCount = 0;
    for (let i = 0; i < regularUsers.length; i++) {
      const user = regularUsers[i];
      const numFollowers = Math.floor(Math.random() * 6) + 3;

      for (let j = 0; j < numFollowers; j++) {
        const followerIndex = Math.floor(Math.random() * regularUsers.length);
        if (followerIndex !== i) {
          await Profile.findOneAndUpdate(
            { user: user._id },
            {
              $addToSet: { followers: regularUsers[followerIndex]._id },
              $inc: { followersCount: 1 },
            },
          );
          await Profile.findOneAndUpdate(
            { user: regularUsers[followerIndex]._id },
            { $addToSet: { followings: user._id }, $inc: { followingsCount: 1 } },
          );
          followerCount++;
        }
      }
    }
    console.log(`Added ${followerCount} follow relationships`);

    console.log('\n✅ SEED COMPLETED SUCCESSFULLY!');
    console.log('\n📊 Summary:');
    console.log(`   • ${createdUsers.length} Users (Each with 6–8 stories)`);
    console.log(`   • ${createdPosts.length} Total Stories across 10 Categories`);
    console.log(`   • ${commentCount} Comments`);
    console.log(`   • ${likeCount} Likes`);
    console.log(`   • ${viewCount} Views & ${readCount} Completed Reads`);
    console.log('\n📝 Demo / Recruiter Accounts:');
    console.log('───────────────────────────────────────────────────');
    console.log(
      '👤 Primary Creator: john@example.com / password123 (Has 8 stories, active analytics, drafts & private posts)',
    );
    console.log('👤 UX Creator:      jane@example.com / password123 (Has 7 design stories)');
    console.log('👑 Admin:           admin@bloghub.com / admin123');
    console.log('───────────────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
