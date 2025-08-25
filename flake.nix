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
      in
      {
        formatter = pkgs.nixfmt-rfc-style;

        devShells.default = pkgs.mkShell {
          name = "utrp-dev";
          buildInputs = with pkgs; [
            nodejs_20 # v20.19.4
            pnpm_10 # v10.14.0
          ];

          shellHook = ''
            echo "UTRP Nix Flake Environment Loaded"
            echo "Node: $(node --version)"
            echo "pnpm: $(pnpm --version)"
          '';
        };
      }
    );
}
