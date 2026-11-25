# Releasing

Step-by-step checklist for cutting a new BlogHub release. All commands run from the repository root.

## 1. Verify `main` is clean and passing

```bash
git checkout main
git pull origin main
npm test
npm run lint
npm run format:check
npm run build && npm run size
```

## 2. Bump the version

Use the monorepo version script (`scripts/bump-version.js`) to update root, `backend`, and `client` `package.json` and lockfiles together:

```bash
npm run bump:patch    # 1.0.0 -> 1.0.1 (bug fixes, docs, chores)
# or
npm run bump:minor    # 1.0.0 -> 1.1.0 (new backward-compatible features)
# or
npm run bump:major    # 1.0.0 -> 2.0.0 (breaking changes)
```

## 3. Update `CHANGELOG.md`

Move the items under `## [Unreleased]` into a new version heading with today's date:

```markdown
## [Unreleased]

## [1.0.1] - YYYY-MM-DD
```

## 4. Commit and tag

```bash
git add -A
git commit -m "chore(release): v1.0.1"
git tag -a v1.0.1 -m "Release v1.0.1"
```

## 5. Push to GitHub

```bash
git push origin main --tags
```

Pushing a `v*` tag automatically triggers `.github/workflows/release.yml` to publish the GitHub Release page with generated release notes.
