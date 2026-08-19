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
const Tag = require('../models/tag.model');

const DRY = process.argv.includes('--dry');

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 180) || 'story';

/** Writes comment.post on any comment that lacks it. */
async function backfillCommentPosts() {
  const orphans = await Comment.find({ post: { $exists: false } }).select('_id');
  if (orphans.length === 0) {
    console.log('  comments: all already carry a post reference');
    return;
  }

  console.log(`  comments: ${orphans.length} missing post reference`);
  if (DRY) return;

  const posts = await Post.find({ comments: { $in: orphans.map((c) => c._id) } })
    .select('_id comments')
    .lean();

  let repaired = 0;
  for (const post of posts) {
    const result = await Comment.updateMany(
      { _id: { $in: post.comments }, post: { $exists: false } },
      { $set: { post: post._id } },
    );
    repaired += result.modifiedCount;
  }

  console.log(`  comments: linked ${repaired} to their post`);
}

/**
 * Ensures the slug column satisfies the unique index.
 *
 * Posts that share a slug receive a `-2`, `-3`, … suffix. The oldest post with a given slug
 * keeps it; the newer ones are rewritten so the URL people are most likely to already have
 * continues to work.
 */
async function deduplicateSlugs() {
  const duplicates = await Post.aggregate([
    { $group: { _id: '$slug', count: { $sum: 1 }, ids: { $push: '$_id' } } },
    { $match: { count: { $gt: 1 } } },
  ]);

  if (duplicates.length === 0) {
    console.log('  slugs: already unique');
    return;
  }

  console.log(`  slugs: ${duplicates.length} duplicate groups to resolve`);
  if (DRY) return;

  let changed = 0;
  for (const group of duplicates) {
    // Keep the first (by creation time); rewrite the rest.
    const posts = await Post.find({ _id: { $in: group.ids } })
      .sort({ createdAt: 1 })
      .select('_id slug');

    let suffix = 2;
    for (let i = 1; i < posts.length; i += 1) {
      const id = posts[i]._id;
      let candidate = `${group._id || 'story'}-${suffix}`;
      while (await Post.exists({ _id: { $ne: id }, slug: candidate })) {
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

/** Ensures all existing posts have corresponding dynamic tags. */
async function migrateTagsFromCategories() {
  const postsCollection = mongoose.connection.db.collection('posts');
  const postsNeedingTags = await postsCollection
    .find({
      $or: [{ tags: { $exists: false } }, { tags: { $size: 0 } }],
    })
    .toArray();

  if (postsNeedingTags.length === 0) {
    console.log('  tags: all posts already have dynamic tags');
    return;
  }

  console.log(`  tags: ${postsNeedingTags.length} posts need dynamic tags`);
  if (DRY) return;

  const tagMap = new Map();
  const getOrCreateTag = async (rawName) => {
    const clean = String(rawName || '').trim().toLowerCase();
    if (!clean) return null;
    if (tagMap.has(clean)) return tagMap.get(clean);
    let tag = await Tag.findOne({ name: clean });
    if (!tag) {
      tag = await Tag.create({ name: clean, posts: [] });
    }
    tagMap.set(clean, tag);
    return tag;
  };

  let migrated = 0;
  for (const post of postsNeedingTags) {
    const rawCategories = Array.isArray(post.categories) ? post.categories : [];
    const namesToUse = rawCategories.length > 0 ? ['stories', 'general'] : ['stories'];

    const tagDocs = (await Promise.all(namesToUse.map(getOrCreateTag))).filter(Boolean);
    const tagIds = tagDocs.map((t) => t._id);

    await postsCollection.updateOne({ _id: post._id }, { $set: { tags: tagIds } });

    for (const tagDoc of tagDocs) {
      await Tag.updateOne({ _id: tagDoc._id }, { $addToSet: { posts: post._id } });
    }
    migrated += 1;
  }

  console.log(`  tags: migrated dynamic tags for ${migrated} existing posts`);
}

/** Builds the indexes the models declare, now that the data can satisfy them. */
async function syncIndexes() {
  if (DRY) {
    console.log('  indexes: would sync');
    return;
  }
  await Promise.all([Post.syncIndexes(), Comment.syncIndexes(), Tag.syncIndexes()]);
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
  await migrateTagsFromCategories();
  await syncIndexes();

  await mongoose.disconnect();
  console.log(DRY ? '\nDry run complete.\n' : '\nDone.\n');
})().catch(async (error) => {
  console.error('\nFailed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
