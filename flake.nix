{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    inputs:
    inputs.flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = (import (inputs.nixpkgs) { inherit system; });
      in
      {
        formatter = pkgs.nixfmt-rfc-style;

        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_20 # v20.19.0
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
