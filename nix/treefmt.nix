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
        programs.prettier.enable = true;
        programs.shellcheck.enable = true;
        programs.yamlfmt.enable = true;
        programs.dockerfmt.enable = true;

        settings.formatter.shellcheck.excludes = [ ".envrc" ];
        settings.formatter.yamlfmt.excludes = [ "pnpm-lock.yaml" ];
      };
    };
}
