{ inputs, ... }:
{
  perSystem =
    { pkgs, ... }:
    let
      packageJson = builtins.fromJSON (builtins.readFile ../package.json);
      gitRev = inputs.self.shortRev or inputs.self.dirtyShortRev or "dev";
      gitBranch = if inputs.self ? ref then inputs.self.ref else "unknown";
      baseVersion = packageJson.version;

      commonArgs = {
        inherit gitRev gitBranch;
      };

      # Prod variant
      ut-registration-plus = pkgs.callPackage ./package.nix (
        commonArgs
        // {
          version = "${baseVersion}+git.${gitRev}";
          buildScript = "build";
        }
      );

      # Dev variant
      ut-registration-plus-dev = pkgs.callPackage ./package.nix (
        commonArgs
        // {
          version = "${baseVersion}-dev+git.${gitRev}";
          buildScript = "build:dev";
        }
      );

      # Firefox variant
      ut-registration-plus-firefox = pkgs.callPackage ./package.nix (
        commonArgs
        // {
          version = "${baseVersion}+git.${gitRev}";
          buildScript = "build";
          browserTarget = "firefox";
        }
      );
    in
    {
      packages = {
        inherit ut-registration-plus ut-registration-plus-dev ut-registration-plus-firefox;
        default = ut-registration-plus;
        dev = ut-registration-plus-dev;
        firefox = ut-registration-plus-firefox;
      };
    };
}
