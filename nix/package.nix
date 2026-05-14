{
  stdenv,
  lib,
  nodejs,
  pnpm_10,
  pnpmConfigHook,
  fetchPnpmDeps,
  git,
  version ? "dev",
  gitRev ? "unknown",
  gitBranch ? "unknown",
  buildScript ? "build",
}:

stdenv.mkDerivation (finalAttrs: {
  inherit version;
  pname = "ut-registration-plus";

  src = ../.;

  nativeBuildInputs = [
    nodejs
    pnpm_10
    pnpmConfigHook
    git
  ];

  pnpmDeps = fetchPnpmDeps {
    inherit (finalAttrs) pname version src;
    fetcherVersion = 2;
    hash = lib.strings.trim (builtins.readFile ./pnpm-hash);
  };

  # Pass git info to the build
  VITE_GIT_COMMIT = gitRev;
  VITE_GIT_BRANCH = gitBranch;

  buildPhase = ''
    pnpm run ${buildScript}
  '';

  installPhase = ''
    mkdir -p $out
    cp -r dist/* $out/
  '';

  meta = {
    description = "UT Registration Plus";
    homepage = "https://github.com/Longhorn-Developers/UT-Registration-Plus";
    license = lib.licenses.mit;
    maintainers = lib.maintainers.doprz;
    platforms = lib.platforms.unix;
  };
})
