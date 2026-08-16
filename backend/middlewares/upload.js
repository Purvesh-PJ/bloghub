const multer = require('multer');
const { badRequest } = require('../utils/AppError');

// 2 MB. Large enough for a reasonable avatar, small enough that the encoded copy returned in
// JSON stays manageable.
const MAX_AVATAR_BYTES = 2 * 1024 * 1024;

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

/**
 * Avatar upload.
 *
 * Held in memory and written to the user's profile document as a Buffer, which is what the
 * schema has always declared. The previous configuration wrote to `uploads/` on local disk —
 * a directory that is gitignored, never created, and read-only on the deployment target, so
 * the write failed there every time; when it did succeed locally it stored the file *path*
 * into the Buffer field, which the read path then base64-encoded into a broken data URI.
 *
 * Keeping the bytes in Mongo avoids introducing an object store for a 2 MB-capped avatar. If
 * images ever get larger or more numerous, this is the seam to move behind S3.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_AVATAR_BYTES,
    files: 1,
    // Bound the non-file parts too, so the same endpoint cannot be used to post a huge body.
    fields: 20,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(badRequest('Avatar must be a JPEG, PNG, WebP or GIF image', 'UnsupportedType'));
    }
    return cb(null, true);
  },
});

// Note there is deliberately no filename derived from `file.originalname`. That value is
// chosen by the client, and the old configuration interpolated it straight into a path, so
// `../` in a filename escaped the upload directory.
module.exports = { uploadAvatar: upload.single('image'), MAX_AVATAR_BYTES, ALLOWED_TYPES };
