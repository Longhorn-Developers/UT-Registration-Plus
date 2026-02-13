#!/usr/bin/env bash

set -uo pipefail

# Publish Release
# Creates distribution package and displays checksum

echo "Publishing Release"
echo "=================="
echo ""

# Remove old zip files
echo "[1/2] Creating distribution package..."
rm -f package/*.zip 2>/dev/null || true

TEMP_ZIP=$(mktemp)
trap "rm -f $TEMP_ZIP" EXIT

FORCE_COLOR=1 pnpm zip:to-publish 2>&1 | tee "$TEMP_ZIP"

if grep -qi "error\|failed" "$TEMP_ZIP"; then
    echo ""
    echo "ERROR: Package creation failed"
    exit 1
fi

# Find and verify the zip file
ZIP_FILE=$(find package/ -name "*.zip" -type f -print -quit 2>/dev/null)

if [ -z "$ZIP_FILE" ]; then
    echo "ERROR: No package found in package/ directory"
    exit 1
fi

# Calculate SHA256 checksum
echo ""
echo "[2/2] Calculating SHA256 checksum..."
echo "      Package: $ZIP_FILE"
echo ""

if command -v shasum &>/dev/null; then
    shasum -a 256 "$ZIP_FILE"
elif command -v sha256sum &>/dev/null; then
    sha256sum "$ZIP_FILE"
else
    echo "ERROR: Neither shasum nor sha256sum found"
    exit 1
fi

echo ""
echo "Release published successfully!"
echo ""
echo "Package ready for distribution:"
echo "  $ZIP_FILE"
