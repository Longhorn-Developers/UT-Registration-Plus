# Firefox source submission and reviewer build

This guide explains how to rebuild UT Registration Plus and prepare matching
add-on and source packages for Mozilla Add-ons (AMO), following Mozilla's
[source code submission requirements](https://extensionworkshop.com/documentation/publish/source-code-submission/).

## Getting Started

Verified on **macOS 26.6.2, Apple Silicon (arm64)** with:

- **Node.js 24.14.1**, pinned in `.nvmrc`.
- **pnpm 10.33.0**, pinned in `package.json`.
- Internet access to install public dependencies.

Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating), as described
in [README.md](README.md#getting-started). From the extracted source directory, run:

```bash
nvm install
nvm use
npm install --global pnpm@10.33.0
node --version
pnpm --version
```

You can also install these versions using the [Node.js downloads](https://nodejs.org/download/release/v24.14.1/)
and [pnpm installation guide](https://pnpm.io/installation).
Other build tools are installed locally by the build script. No credentials or
private dependencies are needed, though maintainers also need Git, tar, and zip to
create the source archive.

## Firefox Builds

From a fresh extraction of the source ZIP, run:

```bash
node scripts/build-firefox-review.mjs
```

The script checks tool versions, installs the locked dependencies and CRXJS patch,
runs `pnpm build:firefox` and `pnpm lint:firefox`, and packages the result:

- `dist/firefox/`: extension files for inspection and comparison.
- `package/firefox-review/addon.zip`: unsigned add-on package for submission.

It removes `.map` debugging files, which can differ when built in different
folders. Readable source remains in the source ZIP.

Leave the source unchanged and do not add `.env` files.
`firefox-review-build.json` records the original code version and branch so the
rebuilt extension uses the same version information. The script uses fixed build
settings and creates a non-beta build without uploading debugging files to Sentry.

## Source Contents and Tools

The source archive includes:

- `src/` and `public/`: application code, assets, and bundled data.
- `package.json` and `pnpm-lock.yaml`: dependencies and exact versions.
- `patches/`: the CRXJS patch applied during installation.
- `vite.config.ts`, `tsconfig*.json`, and `unocss.config.ts`: build configuration.
- `scripts/`, `.nvmrc`, this README, and `firefox-review-build.json`: build scripts,
  tool versions, instructions, and source metadata.

All build tools run locally and are open source:
[TypeScript](https://github.com/microsoft/typescript-go),
[Vite](https://github.com/vitejs/vite),
[CRXJS](https://github.com/crxjs/chrome-extension-tools),
[UnoCSS](https://github.com/unocss/unocss),
[Sass](https://github.com/sass/dart-sass), and
[web-ext](https://github.com/mozilla/web-ext).
The SQLite WebAssembly runtime comes from [sql.js](https://github.com/sql-js/sql.js).

## Loading the Extension Manually

Requires Firefox 140 or later.

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on**.
3. Select `dist/firefox/manifest.json`.
4. Open the toolbar popup, then **Calendar** or the Settings gear. Try creating a
   schedule or a custom block.

Catalog features require access to UT Austin's course schedule and a UT EID
login. No test credentials are included. Maintainers should provide authorized
review access privately through AMO reviewer notes.

Temporary add-ons are removed when Firefox restarts. Click **Reload** on the
same page after rebuilding.

## Prepare Submission Packages

From a clean checkout on a named branch, with all submission changes committed:

```bash
node scripts/package-firefox-source.mjs
```

This creates `package/firefox-review/source-<commit>.zip`, including the recorded
code version and branch, and enforces Mozilla's 200 MB source-upload limit.
Git history, dependencies, and generated output are excluded.

1. Extract the same source ZIP into folders named `first` and `second`. Run the
   reviewer build script in each folder.
2. From their parent directory, compare the output:

    ```bash
    diff -qr first/dist/firefox second/dist/firefox
    ```

3. Confirm the extracted files match. ZIP timestamps may differ.
4. Upload either resulting `addon.zip` as the extension and `source-<commit>.zip`
   as its source package. Use the packages created above so the add-on matches
   the submitted source.

In AMO's **Notes for Reviewers**, include the source commit and branch, actual
OS and architecture, Node/pnpm versions, build command, comparison result,
and web-ext findings. Point reviewers to this README. After any source change,
regenerate and verify both packages.

See Mozilla's [submission workflow](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)
for the upload screens.

## Verification and Remaining Review

On November 23, 2026, two fresh extractions of commit
`1e46ecd09dd75460bb16e05a2410927ef6d74eb6` (`firefox-support`) were built in the
environment above. All 102 extension files and extracted add-on ZIP contents matched.

web-ext 10.8.0 reported **0 errors, 0 notices, and 11 warnings**: one about the
Android minimum version and data-collection manifest key, and ten about dynamic
HTML assignments/calls in generated bundles. These still need review. No AMO
upload or manual Firefox runtime test was performed. These results apply to
that commit, before the current README edits.

Error and performance reporting can be managed in Settings, below Reduced Motion.
Reporting defaults to on in Chrome. In Firefox, it stays off until the required
data permissions are granted. Manual feedback requests separate permission to
share your email and message.
