#!/usr/bin/env nu

use std/log

# Publish the release (creates distribution package and displays checksum)
export def main [] {
    print "Publishing Release"
    print "==================\n"

    log info "pnpm zip:to-publish"
    let result = (pnpm zip:to-publish | complete)

    if ($result.stderr | str contains -i "error") or ($result.stderr | str contains -i "failed") {
        error make {msg: "Package creation failed"}
    }

    # Find and verify the zip file
    let zip_files = (ls package/*.zip | where type == file)
    if ($zip_files | is-empty) {
        error make {msg: "No package found in package/ directory"}
    }

    # Get last modified zip file
    let zip_file = ($zip_files | sort-by -r modified | first | get name)
    let checksum = (open $zip_file | hash sha256)

    log info "Release published successfully!"
    log info "Package ready for distribution:"
    log info $"($zip_file)"
    log info $"SHA256: ($checksum)"
}
