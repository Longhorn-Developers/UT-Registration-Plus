#!/usr/bin/env nu

use std/log

# Stage a new release (bump version, changelog, commit, and tag)
export def main [
    version_type: string = "minor", # Version type: major, minor, or patch
    vcs: string = "jj", # VCS: jj or git
] {
    print "Staging Release"
    print "===============\n"

    if $version_type not-in ["major, minor", "patch"] {
        error make {msg: $"version_type must be major, minor, or patch.\nGot: ($version_type)"}
    }

    if $vcs not-in ["jj", "git"] {
        error make {msg: $"vcs must be jj or git.\nGot: ($vcs)"}
    }


    log info $"Using ($vcs)"
    if $vcs == "git" {
        # Check for uncommitted changes (git only)
        let status = (git diff-index --quiet HEAD -- | complete)
        if $status.exit_code != 0 {
            error make {msg: "You have uncommitted changes. Please commit or stash them first."}
        }
    }

    # Bump version in package.json without committing or tagging
    log info "Bumping version in package.json..."
    npm version $version_type --no-git-tag-version | complete

    let new_version = (open package.json | get version)
    log debug $"New version: ($new_version)"

    changelog

    log info "Committing changes..."
    if $vcs == "jj" {
        jj commit -m $"chore: release v($new_version)"
        log debug "Commit created"

        # Update main bookmark (jj only)
        log info "Updating main bookmark..."
        jj bookmark set main -r @
        log debug "Bookmark 'main' updated to current commit"
    } else {
        git add package.json package-lock.json CHANGELOG.md
        git commit -m $"chore: release v($new_version)"
    }

    if $vcs == "jj" {
        log info "Creating annotated tag via git..."
        jj git export
        git tag -a $"v($new_version)" -m $"Release v($new_version)"
        jj git import
        log debug $"Annotated tag 'v($new_version)' created via git"
    } else {
        log info "Creating annotated tag..."
        git tag -a $"v($new_version)" -m $"Release v($new_version)"
        log debug $"Annotated tag 'v($new_version)' created"
    }

    log info $"Release v($new_version) staged successfully!"
    print "Next steps:"
    if $vcs == "jj" {
        print "  - Review changes: jj show @-"
        print "  - Push to remote: jj git push && git push --tags"
    } else {
        print "  - Review changes: git show"
        print "  - Push to remote: git push && git push --tags"
    }
}

def changelog [] {
    log info "Generating changelog with new version..."
    let changelog_exists = ("CHANGELOG.md" | path exists)
    let changelog_before = if $changelog_exists {
        (ls CHANGELOG.md | get modified | first)
    }

    let result = (pnpm generate-changelog | complete)
    if ($result.stderr | str contains -i "error") or ($result.stderr | str contains -i "failed") or ($result.stderr | str contains -i "command not found") {
        error make {msg: "Changelog generation failed"}
    }

    if not ("CHANGELOG.md" | path exists) {
        error make {msg: "CHANGELOG.md was not created"}
    }

    let changelog_after = (ls CHANGELOG.md | get modified | first)
    if $changelog_exists and ($changelog_after <= $changelog_before) {
        error make {msg: "CHANGELOG.md was not updated"}
    }
}
