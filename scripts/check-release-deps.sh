#!/usr/bin/env bash

set -uo pipefail

# Check Release Dependencies
# Validates environment and requirements before releasing

echo "Checking Release Dependencies"
echo "=============================="
echo ""

# Check if .env file exists
echo "[1/3] Checking .env file..."
if [ ! -f .env ]; then
    echo "ERROR: .env file not found"
    exit 1
fi
echo "      .env file found"

# Source the .env file and validate required variables
set +u
source .env
set -u

echo "[2/3] Validating Sentry configuration..."

if [ -z "${SENTRY_ORG:-}" ] || [ "$SENTRY_ORG" != "longhorn-developers" ]; then
    echo "ERROR: SENTRY_ORG must be set to 'longhorn-developers' in .env"
    exit 1
fi
echo "      SENTRY_ORG: $SENTRY_ORG"

if [ -z "${SENTRY_PROJECT:-}" ] || [ "$SENTRY_PROJECT" != "ut-registration-plus" ]; then
    echo "ERROR: SENTRY_PROJECT must be set to 'ut-registration-plus' in .env"
    exit 1
fi
echo "      SENTRY_PROJECT: $SENTRY_PROJECT"

if [ -z "${SENTRY_AUTH_TOKEN:-}" ]; then
    echo "ERROR: SENTRY_AUTH_TOKEN must be populated in .env"
    exit 1
fi
echo "      SENTRY_AUTH_TOKEN: [set]"

# Check for required commands
echo "[3/3] Checking required commands..."

MISSING_DEPS=()

if ! command -v pnpm &>/dev/null; then
    MISSING_DEPS+=("pnpm")
fi

if ! command -v npm &>/dev/null; then
    MISSING_DEPS+=("npm")
fi

if ! command -v conventional-changelog &>/dev/null; then
    MISSING_DEPS+=("conventional-changelog")
fi

# Check for version control
if command -v jj &>/dev/null; then
    echo "      Version control: jujutsu"
elif command -v git &>/dev/null; then
    echo "      Version control: git"
else
    MISSING_DEPS+=("git or jujutsu")
fi

if [ ${#MISSING_DEPS[@]} -ne 0 ]; then
    echo ""
    echo "ERROR: Missing required dependencies:"
    for dep in "${MISSING_DEPS[@]}"; do
        echo "  - $dep"
    done
    exit 1
fi

echo "      All required commands found"
echo ""
echo "All dependency checks passed."
