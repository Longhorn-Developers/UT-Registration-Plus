# Firefox source submission and reviewer build

This document describes the dedicated AMO review build. It does not establish that
the extension is ready to publish. Finish the Firefox review, including data
collection declarations and consent handling, before making a submission.

## Environment and tools

- macOS or Linux, with a POSIX shell. Windows users should use WSL2 with Ubuntu.
- Node.js **24.14.1**, as pinned in `.nvmrc`.
- pnpm **10.33.0**, as pinned in `package.json`.
- Internet access to install public dependencies from the committed lockfile.
- Git, tar, and zip are needed only by maintainers to create the source archive.
  Reviewers building an extracted source archive do not need Git.
- Allow approximately 10 GB RAM and 35 GB free disk space. Final verification must
  record the actual OS and CPU architecture used; cross-platform reproducibility
  has not yet been established.

The preparation workflow has been exercised on macOS 26.6.2 (arm64). Linux and
Windows/WSL builds have not yet been verified. Two builds in separate extracted
source directories produced identical extension files and ZIP entry contents
after removing source maps. This is a preparation check, not verification of a
final release commit. The current web-ext run reports zero errors and 11 warnings;
review those warnings again against the finalized extension before submission.

Install Node with [nvm's installation instructions](https://github.com/nvm-sh/nvm#installing-and-updating),
then run these commands from the extracted source directory:

```sh
nvm install 24.14.1
nvm use 24.14.1
npm install --global pnpm@10.33.0
node --version
pnpm --version
```

Alternatively, install Node 24.14.1 from the
[official Node.js release downloads](https://nodejs.org/download/release/v24.14.1/).
The build script checks both tool versions. No global Vite, TypeScript, web-ext,
Nix, Sentry CLI, credentials, or private dependencies are required.

## Rebuild the submitted add-on

Use a fresh extraction of the source ZIP. Do not add `.env` files or modify the
sources or `firefox-review-build.json`.

```sh
node scripts/build-firefox-review.mjs
```

The script performs all technical steps:

1. Check the pinned Node and pnpm versions.
2. Install dependencies with `pnpm install --frozen-lockfile`, including the CRXJS
   patch under `patches/`.
3. Type-check and build the Firefox extension.
4. Remove generated `.map` debug files, which contain unstable internal Vite
   asset identifiers. Original readable sources remain in the source ZIP.
5. Validate the generated extension with the locked web-ext linter.
6. Package the extension using the locked web-ext build command.

Outputs:

- `dist/firefox/`: generated extension files for comparison and temporary loading.
- `package/firefox-review/addon.zip`: unsigned add-on package for submission.

The script sets the Firefox target and recorded Git metadata explicitly, and
does not inherit shell build flags or Sentry credentials. It uses the regular
non-beta build, without the release script's Sentry sourcemap injection/upload.
This does **not** disable the extension's runtime Sentry reporting.

`firefox-review-build.json` records the source commit and branch because the
extension embeds them and the source archive intentionally contains no `.git`
directory. It also records the packaging host, which is not proof of a successful
build on that host. Console timestamps and build durations are diagnostic output.

## Prepare the final source package (maintainers)

After the PR and these submission tools are finalized and committed, use a clean
checkout on a named branch:

```sh
node scripts/package-firefox-source.mjs
```

This archives the committed source, lockfile, patches, configuration, and assets,
and adds the recorded build metadata. It excludes untracked and ignored files,
such as dependencies, local secrets, generated build output, and Git history.
The script refuses a dirty checkout and enforces the 200 MB source ZIP limit.

Extract `package/firefox-review/source-<commit>.zip` into a new directory and run
its build script. Submit the resulting `addon.zip` alongside that source ZIP.
Do not pair it with a CI artifact or `zip:to-publish:firefox` build, which may use
different metadata or postprocessing.

Before uploading, repeat the build from a second fresh source extraction and
compare the generated files, for example:

```sh
diff -qr first/dist/firefox second/dist/firefox
```

The command must report no differences. Compare extracted add-on contents, not
ZIP bytes, since archive timestamps may differ. Record the tested OS version,
architecture, commit, tool versions, and result in the AMO reviewer notes.
If source changes, regenerate both packages and repeat verification.

See Mozilla's [source code submission requirements](https://extensionworkshop.com/documentation/publish/source-code-submission/).
