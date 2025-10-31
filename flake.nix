{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = (import nixpkgs { inherit system; });

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
        formatter = pkgs.nixfmt-rfc-style;

        devShells.default = pkgs.mkShell {
          name = "utrp-dev";
          buildInputs = commonPackages;
        };

        devShells.full = pkgs.mkShell {
          name = "utrp-dev-full";
          buildInputs = commonPackages ++ additionalPackages;
        };
      }
    );
}
