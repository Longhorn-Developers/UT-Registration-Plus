# Check release dependencies
check-deps:
    ./scripts/check-release-deps.sh

# Stage a new release (bump version, changelog, commit, tag)
stage-release version="minor":
    ./scripts/stage-release.sh {{version}}

# Publish the release (create distribution package)
publish-release:
    ./scripts/publish-release.sh

# Complete release workflow
release version="minor": check-deps (stage-release version) publish-release
    @echo ""
    @echo "Complete release workflow finished!"
    @echo "Don't forget to push your changes to the remote repository."
