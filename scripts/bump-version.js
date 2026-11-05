#!/usr/bin/env node

/**
 * Monorepo Version Bump Utility
 *
 * Synchronizes semantic versions across root, backend, and client packages
 * including package-lock.json files in a single command.
 *
 * Usage:
 *   npm run bump patch        # 1.0.0 -> 1.0.1
 *   npm run bump minor        # 1.0.0 -> 1.1.0
 *   npm run bump major        # 1.0.0 -> 2.0.0
 *   npm run bump 1.2.3        # Set explicit target version
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const targetArg = process.argv[2];

if (!targetArg) {
  console.error('\x1b[31mError: Missing version target.\x1b[0m');
  console.log('\nUsage:');
  console.log('  npm run bump patch      (e.g. 1.0.0 -> 1.0.1)');
  console.log('  npm run bump minor      (e.g. 1.0.0 -> 1.1.0)');
  console.log('  npm run bump major      (e.g. 1.0.0 -> 2.0.0)');
  console.log('  npm run bump <x.y.z>    (e.g. 1.2.3)');
  process.exit(1);
}

const rootPkgPath = path.join(rootDir, 'package.json');
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
const currentVersion = rootPkg.version;

let newVersion;
const semverRegex = /^\d+\.\d+\.\d+$/;

if (['patch', 'minor', 'major'].includes(targetArg.toLowerCase())) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);
  const type = targetArg.toLowerCase();
  if (type === 'patch') {
    newVersion = `${major}.${minor}.${patch + 1}`;
  } else if (type === 'minor') {
    newVersion = `${major}.${minor + 1}.0`;
  } else if (type === 'major') {
    newVersion = `${major + 1}.0.0`;
  }
} else {
  const cleaned = targetArg.replace(/^v/, '');
  if (!semverRegex.test(cleaned)) {
    console.error(
      `\x1b[31mError: Invalid semver version "${targetArg}". Expected format: x.y.z (e.g. 1.1.0)\x1b[0m`
    );
    process.exit(1);
  }
  newVersion = cleaned;
}

if (newVersion === currentVersion) {
  console.log(
    `\x1b[33mTarget version is same as current (${currentVersion}). Nothing to update.\x1b[0m`
  );
  process.exit(0);
}

function updateJsonFile(filePath, updater) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  updater(content);
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
}

console.log(`\x1b[36mBumping BlogHub monorepo version:\x1b[0m ${currentVersion} -> \x1b[32m${newVersion}\x1b[0m\n`);

// 1. Root package.json
updateJsonFile(rootPkgPath, (pkg) => {
  pkg.version = newVersion;
});
console.log(`✓ Updated ${path.relative(rootDir, rootPkgPath)}`);

// 2. Backend package.json & lockfile
const backendPkgPath = path.join(rootDir, 'backend', 'package.json');
const backendLockPath = path.join(rootDir, 'backend', 'package-lock.json');
if (fs.existsSync(backendPkgPath)) {
  updateJsonFile(backendPkgPath, (pkg) => {
    pkg.version = newVersion;
  });
  console.log(`✓ Updated ${path.relative(rootDir, backendPkgPath)}`);
}
if (fs.existsSync(backendLockPath)) {
  updateJsonFile(backendLockPath, (lock) => {
    lock.version = newVersion;
    if (lock.packages && lock.packages['']) {
      lock.packages[''].version = newVersion;
    }
  });
  console.log(`✓ Updated ${path.relative(rootDir, backendLockPath)}`);
}

// 3. Client package.json & lockfile
const clientPkgPath = path.join(rootDir, 'client', 'package.json');
const clientLockPath = path.join(rootDir, 'client', 'package-lock.json');
if (fs.existsSync(clientPkgPath)) {
  updateJsonFile(clientPkgPath, (pkg) => {
    pkg.version = newVersion;
  });
  console.log(`✓ Updated ${path.relative(rootDir, clientPkgPath)}`);
}
if (fs.existsSync(clientLockPath)) {
  updateJsonFile(clientLockPath, (lock) => {
    lock.version = newVersion;
    if (lock.packages && lock.packages['']) {
      lock.packages[''].version = newVersion;
    }
  });
  console.log(`✓ Updated ${path.relative(rootDir, clientLockPath)}`);
}

console.log(`\n\x1b[32mSuccessfully bumped all packages to v${newVersion}!\x1b[0m`);
console.log(`\x1b[90mNext steps:\x1b[0m`);
console.log(`  1. Review/update CHANGELOG.md for v${newVersion}`);
console.log(`  2. git commit -am "chore(release): bump version to ${newVersion}"`);
console.log(`  3. git tag -a v${newVersion} -m "Release v${newVersion}"`);
console.log(`  4. git push origin main && git push origin v${newVersion}\n`);
