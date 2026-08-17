/*
  Brings an existing database in line with the current models — without deleting anything.

  seed.js wipes and repopulates, which is right for a fresh local database and wrong for one
  that already holds content you want to keep. This only repairs what the newer code needs:

    1. comment.post — comments written before that back-reference existed are reachable only
       by walking post.comments, so every post-scoped query misses them. That is why a story
       can show "0 responses" while its comments plainly exist.

    2. duplicate slugs — the slug index is unique now. Where duplicates already exist the
       index cannot be built, so it silently is not, and nothing enforces uniqueness.

  Run with --dry to see what it would change and touch nothing.
*/
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const mongoose = require('mongoose');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

const DRY = process.argv.includes('--dry');

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 180) || 'story';

/** Fills in comment.post from the post.comments arrays that already point at them. */
async function backfillCommentPosts() {
  const orphans = await Comment.countDocuments({ post: { $in: [null, undefined] } });
  if (orphans === 0) {
    console.log('  comments: all already carry a post reference');
    return;
  }

  console.log(`  comments: ${orphans} without a post reference`);
  if (DRY) return;

  let fixed = 0;
  const cursor = Post.find({ comments: { $ne: [] } })
    .select('comments')
    .lean()
    .cursor();

  for await (const post of cursor) {
    const result = await Comment.updateMany(
      { _id: { $in: post.comments }, post: { $in: [null, undefined] } },
      { $set: { post: post._id } },
    );
    fixed += result.modifiedCount;
  }

  const stranded = await Comment.countDocuments({ post: { $in: [null, undefined] } });
  console.log(`  comments: linked ${fixed}${stranded ? `, ${stranded} still orphaned` : ''}`);

  if (stranded > 0) {
    console.log('    (no post lists them; they belong to nothing and can be deleted by hand)');
  }
}

/** Gives every post a slug, and makes repeats unique so the index can be built. */
async function deduplicateSlugs() {
  const groups = await Post.aggregate([
    { $group: { _id: '$slug', ids: { $push: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  const missing = await Post.countDocuments({ $or: [{ slug: null }, { slug: '' }] });

  if (groups.length === 0 && missing === 0) {
    console.log('  slugs: already unique');
    return;
  }

  console.log(`  slugs: ${groups.length} duplicated, ${missing} missing`);
  if (DRY) return;

  let changed = 0;

  for (const post of await Post.find({ $or: [{ slug: null }, { slug: '' }] }).select('title')) {
    post.slug = slugify(post.title);
    await post.save();
    changed += 1;
  }

  for (const group of groups) {
    // The first keeps the slug; the rest get a numbered suffix, as createPost would have done.
    const [, ...rest] = group.ids;
    let suffix = 2;
    for (const id of rest) {
      let candidate = `${group._id || 'story'}-${suffix}`;
      while (await Post.exists({ slug: candidate })) {
        suffix += 1;
        candidate = `${group._id || 'story'}-${suffix}`;
      }
      await Post.updateOne({ _id: id }, { $set: { slug: candidate } });
      changed += 1;
      suffix += 1;
    }
  }

  console.log(`  slugs: rewrote ${changed}`);
}

/** Builds the indexes the models declare, now that the data can satisfy them. */
async function syncIndexes() {
  if (DRY) {
    console.log('  indexes: would sync');
    return;
  }
  await Promise.all([Post.syncIndexes(), Comment.syncIndexes()]);
  console.log('  indexes: synced');
}

(async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_DB_URI || process.env.DB_URI;
  if (!uri) {
    console.error('Set MONGO_DB_URI to the database you want to repair.');
    process.exit(1);
  }

  console.log(`\nTarget: ${uri.replace(/\/\/[^@]*@/, '//<credentials>@')}`);
  console.log(DRY ? 'Mode:   dry run, nothing will be written\n' : 'Mode:   applying changes\n');

  await mongoose.connect(uri);

  await backfillCommentPosts();
  await deduplicateSlugs();
  await syncIndexes();

  await mongoose.disconnect();
  console.log(DRY ? '\nDry run complete.\n' : '\nDone.\n');
})().catch(async (error) => {
  console.error('\nFailed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
