{
  stdenv,
  nodejs,
  pnpm_10,
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
    pnpm_10.configHook
    git
  ];

  pnpmDeps = pnpm_10.fetchDeps {
    inherit (finalAttrs) pname version src;
    fetcherVersion = 2;
    hash = "sha256-UqHymJWvlTV4glra/6DkxuCxbG5dpPkFcnvq3vuxsJ8=";
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
})
