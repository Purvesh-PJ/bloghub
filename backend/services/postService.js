const Post = require('../models/post.model');
const User = require('../models/user.model');
const Tag = require('../models/tag.model');
const { badRequest, notFound } = require('../utils/AppError');

const MAX_TAGS_PER_POST = 5;

/**
 * Turns a list of tag names into Tag ids, creating any that do not exist yet.
 *
 * Tags are author-supplied rather than an administered vocabulary — unlike categories, which
 * stay a fixed list an administrator curates. The Tag collection, its routes and the `tags`
 * array on Post all existed already; nothing ever wrote to them.
 *
 * @param {string[]} names raw tag names from the request
 * @returns {Promise<import('mongoose').Types.ObjectId[]>}
 */
const resolveTags = async (names) => {
  const cleaned = [
    ...new Set(
      (names ?? [])
        .filter((name) => typeof name === 'string')
        .map((name) => name.trim().toLowerCase())
        .filter(Boolean),
    ),
  ].slice(0, MAX_TAGS_PER_POST);

  if (cleaned.length === 0) return [];

  // One upsert per name, in parallel. `new: true` with `upsert` returns the existing document
  // when there is one, so a repeated tag does not create a duplicate.
  const tags = await Promise.all(
    cleaned.map((name) =>
      Tag.findOneAndUpdate(
        { name },
        { $setOnInsert: { name } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      ),
    ),
  );

  return tags.map((tag) => tag._id);
};

/** Keeps the back-reference on each Tag in step with a post's tag list. */
const syncTagBackrefs = async (postId, nextIds, previousIds = []) => {
  const next = nextIds.map(String);
  const previous = previousIds.map(String);

  const added = next.filter((id) => !previous.includes(id));
  const removed = previous.filter((id) => !next.includes(id));

  await Promise.all([
    added.length && Tag.updateMany({ _id: { $in: added } }, { $addToSet: { posts: postId } }),
    removed.length && Tag.updateMany({ _id: { $in: removed } }, { $pull: { posts: postId } }),
  ]);
};

const VISIBILITIES = ['draft', 'private', 'public'];

const normalizeVisibility = (value) => (VISIBILITIES.includes(value) ? value : 'draft');

const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 180) || 'story';

/**
 * Resolves a slug that no other post is using.
 *
 * The slug column is unique, so two posts titled the same way would otherwise collide on
 * insert. Appends `-2`, `-3`, … until the name is free.
 *
 * @param {string} base slug candidate
 * @param {string} [excludeId] post allowed to keep the slug (itself, when updating)
 */
const uniqueSlug = async (base, excludeId) => {
  const query = excludeId ? { _id: { $ne: excludeId } } : {};

  for (let attempt = 1; attempt <= 50; attempt += 1) {
    const candidate = attempt === 1 ? base : `${base}-${attempt}`;
    const taken = await Post.exists({ ...query, slug: candidate });
    if (!taken) return candidate;
  }

  // A pathological number of collisions on one title; fall back to something unmistakably
  // unique rather than failing the request.
  return `${base}-${Date.now()}`;
};

exports.createPost = async (userId, postData) => {
  if (!userId || !postData) {
    throw badRequest('User ID and post data are required');
  }

  const title = (postData.title || '').trim();
  const content = postData.content;
  if (!title || !content) {
    throw badRequest('Title and content are required to create a post');
  }

  const slug = await uniqueSlug(slugify(postData.slug || title));
  const tagIds = await resolveTags(postData.tags);

  const newPost = await Post.create({
    user: userId,
    imageURL: postData.imageURL || '',
    title,
    slug,
    content,
    tags: tagIds,
    visibility: normalizeVisibility(postData.visibility),
  });

  await Promise.all([
    // Targeted push rather than load-mutate-save, which rewrote the whole user document.
    User.updateOne({ _id: userId }, { $addToSet: { posts: newPost._id } }),
    syncTagBackrefs(newPost._id, tagIds),
  ]);

  return newPost;
};

exports.updatePost = async (post, postId) => {
  const targetId = typeof postId === 'object' ? postId._id || postId.id : postId;
  const existing = await Post.findById(targetId);
  if (!existing) {
    throw notFound('Post not found');
  }

  const title = post.title !== undefined ? String(post.title).trim() : existing.title;
  const content = post.content !== undefined ? post.content : existing.content;
  const imageURL = post.imageURL !== undefined ? post.imageURL : existing.imageURL;

  const update = {
    imageURL: imageURL || '',
    title,
    content,
    // Recorded here and nowhere else, so it means "the author changed the story" rather than
    // "the document was written to" — see the field's note on the schema.
    editedAt: new Date(),
  };

  // Only re-derive the slug when one was supplied or the title changed; otherwise a plain
  // edit would keep rewriting the URL a post is already known by.
  if (post.slug) {
    update.slug = await uniqueSlug(slugify(post.slug), targetId);
  } else if (title !== existing.title || !existing.slug) {
    update.slug = await uniqueSlug(slugify(title), targetId);
  }

  if (post.visibility !== undefined) {
    update.visibility = normalizeVisibility(post.visibility);
  }

  // Only touched when the caller actually sent a tag list, so a partial update that omits
  // `tags` leaves the existing ones alone rather than clearing them.
  if (post.tags !== undefined) {
    update.tags = await resolveTags(post.tags);
    await syncTagBackrefs(targetId, update.tags, existing.tags ?? []);
  }

  return Post.findByIdAndUpdate(targetId, update, { new: true, runValidators: true });
};
