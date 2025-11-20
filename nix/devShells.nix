{
  perSystem =
    {
      pkgs,
      ...
    }:
    let
      commonPackages = with pkgs; [
        nodejs # Defined in overlay
        pnpm_10 # v10.18.2
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
    };
}
