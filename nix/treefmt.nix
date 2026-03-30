{ inputs, ... }:
{
  imports = [
    inputs.treefmt-nix.flakeModule
  ];

  perSystem =
    { pkgs, ... }:
    let
      ext.js = [
        "*.js"
        "*.ts"
        "*.mjs"
        "*.mts"
        "*.cjs"
        "*.cts"
        "*.jsx"
        "*.tsx"
        "*.d.ts"
        "*.d.cts"
        "*.d.mts"
      ];

      ext.json = [
        "*.json"
        "*.jsonc"
      ];

      ext.css = [
        "*.css"
      ];
    in
    {
      treefmt = {
        projectRootFile = "flake.nix";
        programs.nixfmt.enable = true;

        programs.shellcheck.enable = true;
        programs.yamlfmt.enable = true;
        programs.dockerfmt.enable = true;

        # NOTE: Make sure the biome version in package.json and the one used by treefmt are the same
        settings.formatter.biome = {
          command = "${pkgs.biome}/bin/biome";
          options = [
            "check"
            "--write"
            "--no-errors-on-unmatched"
          ];
          includes = ext.js ++ ext.json ++ ext.css;
        };

        settings.formatter.shellcheck.excludes = [ ".envrc" ];
        settings.formatter.yamlfmt.excludes = [ "pnpm-lock.yaml" ];
      };

      checks = {
        biome-version-match = pkgs.runCommand "check-biome-version" { buildInputs = [ pkgs.jq ]; } ''
          # Extract biome version from package.json
          packageJsonVersion=$(jq -r '.devDependencies["@biomejs/biome"] // empty' ${../package.json})

          if [ -z "$packageJsonVersion" ]; then
            echo "Error: @biomejs/biome not found in package.json devDependencies"
            exit 1
          fi

          # Remove any semver prefix characters (^, ~, etc...)
          packageJsonVersion=$(echo "$packageJsonVersion" | sed 's/^[\^~>=<]*//')

          # Get biome version from nixpkgs
          nixVersion="${pkgs.biome.version}"

          if [ "$packageJsonVersion" != "$nixVersion" ]; then
            echo ""
            echo "ERROR: Biome version mismatch!"
            echo "  package.json: $packageJsonVersion"
            echo "  nixpkgs:      $nixVersion"
            echo ""
            echo "Please update one of the following:"
            echo "  - Update @biomejs/biome in package.json to match nixpkgs: $nixVersion"
            echo "  - Override biome in your flake to match package.json"
            exit 1
          fi

          touch $out
        '';
      };
    };
}
