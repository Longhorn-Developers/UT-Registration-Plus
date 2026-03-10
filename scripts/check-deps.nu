#!/usr/bin/env nu

use std/log

# Check release dependencies
export def main [] {
    print "Checking Release Dependencies"
    print "=============================\n"

    log info "Checking .env file..."
    if not (".env" | path exists) {
        error make {msg: ".env file not found"}
    }
    log debug "    .env file found"

    log info "Validating Sentry configuration..."
    # Get env variables dynamically and reduce the table into a record
    let env_vars = (
        open .env
        | lines
        | where { |line| ($line | str trim) != "" and not ($line | str starts-with "#") }
        | each { |line|
            let parts = ($line | split column "=" key value | first)
            { name: ($parts.key | str trim), value: ($parts.value | str trim) }
        }
        | reduce --fold {} { |it, acc| $acc | merge { ($it.name): $it.value } }
    )

    let sentry_org = $env_vars | get SENTRY_ORG?
    if $sentry_org != "longhorn-developers" {
        error make {msg: $"SENTRY_ORG must be set to longhorn-developers in .env\nGot: ($sentry_org)"}
    }
    log debug $"    SENTRY_ORG: ($sentry_org)"


    let sentry_project = $env_vars | get SENTRY_PROJECT?
    if $sentry_project != "ut-registration-plus" {
        error make {msg: $"SENTRY_PROJECT must be set to ut-registration-plus in .env\nGot: ($sentry_project)"}
    }
    log debug $"    SENTRY_PROJECT: ($sentry_project)"

    let sentry_auth_token = $env_vars | get SENTRY_AUTH_TOKEN?
    if ($sentry_auth_token | is-empty) {
        error make {msg: "SENTRY_AUTH_TOKEN must be populated in .env"}
    }
    log debug "    SENTRY_AUTH_TOKEN: [set]"

    #Check for required commands
    mut missing_deps = []

    if (which pnpm | is-empty) {
        $missing_deps = ($missing_deps | append "pnpm")
    }
    if (which npm | is-empty) {
        $missing_deps = ($missing_deps | append "npm")
    }
    if (which conventional-changelog | is-empty) {
        $missing_deps = ($missing_deps | append "conventional-changelog")
    }

    log info "Checking VCS"
    if not (which jj | is-empty) {
        log debug "    Version control: jujutsu"
    } else if not (which git | is-empty) {
        log debug "    Version control: git"
    } else {
        $missing_deps = ($missing_deps | append "git or jujutsu")
    }

    if ($missing_deps | length) > 0 {
        let deps: string = $missing_deps | str join ", "
        let error_msg: string = ("Missing required dependencies: " | append $deps | str join)
        error make { msg: $error_msg }
    }

    log info "All required commands found"
    log info "All dependency checks passed"
}
