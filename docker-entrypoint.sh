#!/usr/bin/env bash

set -euo pipefail

# Define supported modes
SUPPORTED_MODES=("build" "zip" "dev")

# Function to display usage information
usage() {
    echo "Usage: $0 [build|zip|dev]"
    echo "  build: Build the extension"
    echo "  zip: Build and zip the extension"
    echo "  dev: Run in development mode with HMR"
    exit 1
}

# Check if BUILD_MODE is set, otherwise use the first argument
if [ -n "${BUILD_MODE:-}" ]; then
    mode="$BUILD_MODE"
elif [ $# -eq 1 ]; then
    mode="$1"
else
    usage
fi

# Validate the mode
if [[ ! " ${SUPPORTED_MODES[*]} " =~ " ${mode} " ]]; then
    echo "Error: Invalid mode '${mode}'" >&2
    usage
fi

# Execute the appropriate command based on the mode
case "$mode" in
    build)
        echo "Building extension..."
        exec pnpm run build
        ;;
    zip)
        echo "Building and zipping extension..."
        exec pnpm run zip
        ;;
    dev)
        echo "Running in development mode with HMR..."
        exec pnpm run dev
        ;;
esac
