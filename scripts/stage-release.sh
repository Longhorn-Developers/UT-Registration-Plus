#!/usr/bin/env bash

set -uo pipefail

VERSION_TYPE=${1:-minor}

# Stage Release
# Bumps version, generates changelog, and commits changes

echo "Staging Release"
echo "==============="
echo "Version type: $VERSION_TYPE"
echo ""

# Detect version control system
if command -v jj &>/dev/null; then
    VCS="jj"
    echo "Using jujutsu"
elif command -v git &>/dev/null; then
    VCS="git"
    echo "Using git"

    # Check for uncommitted changes (git only)
    if ! git diff-index --quiet HEAD --; then
        echo "ERROR: You have uncommitted changes. Please commit or stash them first."
        exit 1
    fi
else
    echo "ERROR: No version control system found (git or jujutsu required)"
    exit 1
fi

echo ""

# Bump version in package.json WITHOUT committing or tagging
echo "[1/5] Bumping version in package.json..."
npm version $VERSION_TYPE --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "      New version: $NEW_VERSION"

# Generate changelog
echo ""
echo "[2/5] Generating changelog with new version..."

if [ -f CHANGELOG.md ]; then
    CHANGELOG_BEFORE=$(stat -c %Y CHANGELOG.md 2>/dev/null || stat -f %m CHANGELOG.md 2>/dev/null)
else
    CHANGELOG_BEFORE=0
fi

TEMP_CHANGELOG=$(mktemp)
trap "rm -f $TEMP_CHANGELOG" EXIT

FORCE_COLOR=1 pnpm generate-changelog 2>&1 | tee "$TEMP_CHANGELOG"

if grep -qi "error\|failed\|command not found" "$TEMP_CHANGELOG"; then
    echo ""
    echo "ERROR: Changelog generation failed"
    exit 1
fi

if [ -f CHANGELOG.md ]; then
    CHANGELOG_AFTER=$(stat -c %Y CHANGELOG.md 2>/dev/null || stat -f %m CHANGELOG.md 2>/dev/null)
    if [ "$CHANGELOG_AFTER" -le "$CHANGELOG_BEFORE" ]; then
        echo ""
        echo "ERROR: CHANGELOG.md was not updated"
        exit 1
    fi
else
    echo ""
    echo "ERROR: CHANGELOG.md was not created"
    exit 1
fi

# Commit changes
echo ""
echo "[3/5] Committing changes..."

if [ "$VCS" = "jj" ]; then
    jj commit -m "chore: release v$NEW_VERSION"
    echo "      Commit created"
else
    git add package.json package-lock.json CHANGELOG.md
    git commit -m "chore: release v$NEW_VERSION"
    echo "      Commit created"
fi

# Update main bookmark (jujutsu only)
if [ "$VCS" = "jj" ]; then
    echo ""
    echo "[4/5] Updating main bookmark..."
    jj bookmark set main -r @
    echo "      Bookmark 'main' updated to current commit"
fi

# Create tag
echo ""
if [ "$VCS" = "jj" ]; then
    echo "[5/5] Creating annotated tag via git..."
    # Jujutsu doesn't support annotated tags yet, so we use git
    jj git export
    git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
    jj git import
    echo "      Annotated tag 'v$NEW_VERSION' created via git"
else
    echo "[5/5] Creating annotated tag..."
    git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
    echo "      Annotated tag 'v$NEW_VERSION' created"
fi

echo ""
echo "Release v$NEW_VERSION staged successfully!"
echo ""
echo "Next steps:"
if [ "$VCS" = "jj" ]; then
    echo "  - Review changes: jj show @-"
    echo "  - Push to remote: jj git push && git push --tags"
else
    echo "  - Review changes: git show"
    echo "  - Push to remote: git push && git push --tags"
fi
echo "  - Publish release: ./publish-release.sh"
