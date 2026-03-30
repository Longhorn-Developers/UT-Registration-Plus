{
  perSystem =
    { pkgs, ... }:
    let
      update-hash = pkgs.writeShellApplication {
        name = "update-hash";

        runtimeInputs = with pkgs; [
          gnugrep
          gnused
        ];

        text = ''
          HASH_FILE="nix/pnpm-hash"

          if BUILD_OUTPUT=$(nix build .#default --no-link 2>&1); then
            echo "pnpm-hash is up to date"
            exit 0
          fi

          NEW_HASH=$(echo "$BUILD_OUTPUT" | grep -E '^\s+got:' | sed -E 's/.*got:\s+//' | head -1)

          if [[ -z "$NEW_HASH" ]]; then
            echo "Build failed without hash mismatch:"
            echo "$BUILD_OUTPUT"
            exit 1
          fi

          echo "$NEW_HASH" > "$HASH_FILE"
          echo "Updated $HASH_FILE to $NEW_HASH"
        '';
      };
    in
    {
      apps = {
        update-hash = {
          type = "app";
          program = "${update-hash}/bin/update-hash";
        };
      };
    };
}
