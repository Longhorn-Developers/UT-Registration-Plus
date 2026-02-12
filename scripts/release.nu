#!/usr/bin/env nu

use check-deps.nu
use stage-release.nu
use publish-release.nu

# UTRP Release workflow
export def main [
    --bump: string = "minor", # bump type: major, minor, or patch
    --dry-run = true, # Dry run release workflow
] {
    check-deps

    if $dry_run {
        print "\ndry-run todo:"
        print "- stage-release"
        print "- publish-release"
        exit 0
    }

    mut vcs = ""
    if not (which jj | is-empty) { $vcs = "jj" } else if not (which git | is-empty) { $vcs = "git"}

    stage-release $bump $vcs
    publish-release

    print "Release workflow completed!"
}

