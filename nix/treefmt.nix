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
    };
}
