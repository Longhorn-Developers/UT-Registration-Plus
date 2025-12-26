{ inputs, ... }:
{
  imports = [
    inputs.treefmt-nix.flakeModule
  ];

  perSystem =
    { pkgs, ... }:
    {
      treefmt = {
        projectRootFile = "flake.nix";
        programs.nixfmt.enable = pkgs.lib.meta.availableOn pkgs.stdenv.buildPlatform pkgs.nixfmt-rfc-style.compiler;
        programs.nixfmt.package = pkgs.nixfmt-rfc-style;

        # NOTE: Make sure the prettier version in package.json and the one used by treefmt are the same for consistent results
        programs.prettier.enable = true;
        programs.shellcheck.enable = true;
        programs.yamlfmt.enable = true;
        programs.dockerfmt.enable = true;

        settings.formatter.prettier.excludes = [ "pnpm-lock.yaml" ];
        settings.formatter.shellcheck.excludes = [ ".envrc" ];
        settings.formatter.yamlfmt.excludes = [ "pnpm-lock.yaml" ];
      };

      checks = {
        prettier-version-match =
          pkgs.runCommand "check-prettier-version"
            {
              buildInputs = [ pkgs.jq ];
            }
            ''
              # Extract prettier version from package.json
              packageJsonVersion=$(jq -r '.devDependencies.prettier // empty' ${../package.json})

              if [ -z "$packageJsonVersion" ]; then
                echo "Error: prettier not found in package.json devDependencies"
                exit 1
              fi

              # Remove any semver prefix characters (^, ~, etc...)
              packageJsonVersion=$(echo "$packageJsonVersion" | sed 's/^[\^~>=<]*//')

              # Get prettier version from nixpkgs
              nixVersion="${pkgs.nodePackages.prettier.version}"

              if [ "$packageJsonVersion" != "$nixVersion" ]; then
                echo ""
                echo "ERROR: Prettier version mismatch!"
                echo "  package.json: $packageJsonVersion"
                echo "  nixpkgs:      $nixVersion"
                echo ""
                echo "Please update one of the following:"
                echo "  - Update prettier in package.json to match nixpkgs: $nixVersion"
                echo "  - Override prettier in your flake to match package.json"
                exit 1
              fi

              touch $out
            '';
      };
    };
}
