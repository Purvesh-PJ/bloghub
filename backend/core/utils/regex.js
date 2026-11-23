/**
 * Escapes a user-supplied string so it can be used inside a regular expression as text.
 *
 * Every place that builds a `$regex` filter from something a caller typed needs this: without
 * it a search for `.*` matches every row, and one for `C++` is a syntax error. The same
 * expression was written out by hand in three controllers, which is three chances for the
 * fourth one to forget.
 *
 * @param {string} value
 * @returns {string} the value with every regex metacharacter escaped
 */
const escapeRegex = (value) => String(value ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * A case-insensitive "contains" filter for a user-supplied term.
 *
 * @param {string} value
 * @returns {{$regex: string, $options: string}}
 */
const containsIgnoreCase = (value) => ({ $regex: escapeRegex(value), $options: 'i' });

module.exports = { escapeRegex, containsIgnoreCase };
