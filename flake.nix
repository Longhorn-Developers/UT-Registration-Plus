{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-compat.url = "https://flakehub.com/f/edolstra/flake-compat/1.tar.gz";
    treefmt-nix.url = "github:numtide/treefmt-nix";
  };

  outputs =
    inputs@{ flake-parts, systems, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = import systems;
      imports = [
        inputs.treefmt-nix.flakeModule
      ];

      perSystem =
        { pkgs, ... }:
        let
          commonPackages = with pkgs; [
            nodejs_20 # v20.19.5
            pnpm_10 # v10.18.0
          ];

          additionalPackages = with pkgs; [
            bun
            nodePackages.conventional-changelog-cli
            sentry-cli
          ];
        in
        {
          devShells.default = pkgs.mkShell {
            name = "utrp-dev";
            packages = commonPackages;
          };

          devShells.full = pkgs.mkShell {
            name = "utrp-dev-full";
            packages = commonPackages ++ additionalPackages;
          };

          treefmt = {
            programs.nixfmt.enable = pkgs.lib.meta.availableOn pkgs.stdenv.buildPlatform pkgs.nixfmt-rfc-style.compiler;
            programs.nixfmt.package = pkgs.nixfmt-rfc-style;
          };
        };
    };
}
