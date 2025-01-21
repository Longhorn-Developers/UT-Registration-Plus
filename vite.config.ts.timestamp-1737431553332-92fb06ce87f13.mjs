// vite.config.ts
import { crx } from "file:///Users/prestoncook/Desktop/UT-Registration-Plus/node_modules/.pnpm/@crxjs+vite-plugin@2.0.0-beta.21_patch_hash=xq4uab3o3kbvv4gixvawl2aj5q/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import react from "file:///Users/prestoncook/Desktop/UT-Registration-Plus/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.1_@swc+helpers@0.5.15_vite@5.4.11_@types+node@22.9.0_sass@1.81.0_terser@5.36.0_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import UnoCSS from "file:///Users/prestoncook/Desktop/UT-Registration-Plus/node_modules/.pnpm/unocss@0.63.6_postcss@8.4.49_rollup@4.27.2_typescript@5.6.3_vite@5.4.11_@types+node@22.9.0_sass@1.81.0_terser@5.36.0_/node_modules/unocss/dist/vite.mjs";
import Icons from "file:///Users/prestoncook/Desktop/UT-Registration-Plus/node_modules/.pnpm/unplugin-icons@0.19.3_@svgr+core@8.1.0_typescript@5.6.3__@vue+compiler-sfc@3.5.13/node_modules/unplugin-icons/dist/vite.js";
import { defineConfig } from "file:///Users/prestoncook/Desktop/UT-Registration-Plus/node_modules/.pnpm/vite@5.4.11_@types+node@22.9.0_sass@1.81.0_terser@5.36.0/node_modules/vite/dist/node/index.js";
import inspect from "file:///Users/prestoncook/Desktop/UT-Registration-Plus/node_modules/.pnpm/vite-plugin-inspect@0.8.7_rollup@4.27.2_vite@5.4.11_@types+node@22.9.0_sass@1.81.0_terser@5.36.0_/node_modules/vite-plugin-inspect/dist/index.mjs";

// package.json
var package_default = {
  name: "ut-registration-plus",
  displayName: "UT Registration Plus",
  version: "2.0.2",
  description: "UT Registration Plus is a Chrome extension that allows students to easily register for classes.",
  private: true,
  homepage: "https://github.com/Longhorn-Developers/UT-Registration-Plus",
  type: "module",
  scripts: {
    dev: "vite",
    build: "tsc && vite build",
    "build:watch": "NODE_ENV='development' vite build --mode development -w",
    zip: "PROD=true pnpm build && pnpm gulp zipProdBuild",
    prettier: "prettier src --check",
    "prettier:fix": "prettier src --write",
    lint: "eslint src --ext ts,tsx --report-unused-disable-directives",
    "lint:fix": "eslint src --ext ts,tsx --report-unused-disable-directives --fix",
    "check-types": "tsc --noEmit",
    test: "vitest",
    "test:ui": "vitest --ui",
    coverage: "vitest run --coverage",
    preview: "vite preview",
    "generate-changelog": "bun run scripts/generateChangelog.ts",
    preinstall: "npx only-allow pnpm",
    storybook: "storybook dev -p 6006",
    "build-storybook": "storybook build",
    prepare: "husky"
  },
  dependencies: {
    "@headlessui/react": "^2.2.0",
    "@hello-pangea/dnd": "^17.0.0",
    "@octokit/rest": "^21.0.2",
    "@phosphor-icons/react": "^2.1.7",
    "@sentry/react": "^8.38.0",
    "@unocss/vite": "^0.63.6",
    "@vitejs/plugin-react": "^4.3.3",
    "chrome-extension-toolkit": "^0.0.54",
    clsx: "^2.1.1",
    "conventional-changelog": "^6.0.0",
    highcharts: "^11.4.8",
    "highcharts-react-official": "^3.2.1",
    "html-to-image": "^1.11.11",
    husky: "^9.1.6",
    "kc-dabr-wasm": "^0.1.2",
    nanoid: "^5.0.8",
    react: "^18.3.1",
    "react-dom": "^18.3.1",
    "react-loading-skeleton": "^3.5.0",
    "react-markdown": "^9.0.1",
    "react-syntax-highlighter": "^15.6.1",
    "remark-gfm": "^4.0.0",
    sass: "^1.81.0",
    "simple-git": "^3.27.0",
    "sql.js": "1.11.0"
  },
  devDependencies: {
    "@chromatic-com/storybook": "^2.0.2",
    "@commitlint/cli": "^19.5.0",
    "@commitlint/config-conventional": "^19.5.0",
    "@commitlint/types": "^19.5.0",
    "@crxjs/vite-plugin": "2.0.0-beta.21",
    "@iconify-json/bi": "^1.2.1",
    "@iconify-json/ic": "^1.2.1",
    "@iconify-json/iconoir": "^1.2.4",
    "@iconify-json/material-symbols": "^1.2.6",
    "@iconify-json/ri": "^1.2.3",
    "@iconify-json/streamline": "^1.2.1",
    "@semantic-release/exec": "^6.0.3",
    "@sentry/types": "^8.38.0",
    "@storybook/addon-designs": "^8.0.4",
    "@storybook/addon-essentials": "^8.4.4",
    "@storybook/addon-links": "^8.4.4",
    "@storybook/blocks": "^8.4.4",
    "@storybook/react": "^8.4.4",
    "@storybook/react-vite": "^8.4.4",
    "@storybook/test": "^8.4.4",
    "@svgr/core": "^8.1.0",
    "@svgr/plugin-jsx": "^8.1.0",
    "@types/chrome": "^0.0.273",
    "@types/conventional-changelog": "^3.1.5",
    "@types/gulp": "^4.0.17",
    "@types/gulp-zip": "^4.0.4",
    "@types/node": "^22.9.0",
    "@types/prompts": "^2.4.9",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/react-syntax-highlighter": "^15.5.13",
    "@types/semantic-release": "^20.0.6",
    "@types/semver": "^7.5.8",
    "@types/sql.js": "^1.4.9",
    "@typescript-eslint/eslint-plugin": "^7.18.0",
    "@typescript-eslint/parser": "^7.18.0",
    "@unocss/eslint-config": "^0.63.6",
    "@unocss/postcss": "^0.63.6",
    "@unocss/preset-uno": "^0.63.6",
    "@unocss/preset-web-fonts": "^0.63.6",
    "@unocss/reset": "^0.63.6",
    "@unocss/transformer-directives": "^0.63.6",
    "@unocss/transformer-variant-group": "^0.63.6",
    "@vitejs/plugin-react-swc": "^3.7.1",
    "@vitest/coverage-v8": "^2.1.5",
    "@vitest/ui": "^2.1.5",
    chalk: "^5.3.0",
    chromatic: "^11.18.1",
    cssnano: "^7.0.6",
    "cssnano-preset-advanced": "^7.0.6",
    dotenv: "^16.4.5",
    "es-module-lexer": "^1.5.4",
    eslint: "^8.57.1",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-airbnb-typescript": "^18.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-import-resolver-typescript": "^3.6.3",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-import-essentials": "^0.2.1",
    "eslint-plugin-jsdoc": "^50.5.0",
    "eslint-plugin-prettier": "^5.2.1",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^4.6.2",
    "eslint-plugin-react-prefer-function-component": "^3.3.0",
    "eslint-plugin-react-refresh": "^0.4.14",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "eslint-plugin-storybook": "^0.9.0",
    "eslint-plugin-tsdoc": "^0.3.0",
    gulp: "^5.0.0",
    "gulp-execa": "^7.0.1",
    "gulp-zip": "^6.0.0",
    path: "^0.12.7",
    postcss: "^8.4.49",
    prettier: "^3.3.3",
    "react-dev-utils": "^12.0.1",
    "semantic-release": "^24.2.0",
    storybook: "^8.4.4",
    typescript: "^5.6.3",
    unocss: "^0.63.6",
    "unocss-preset-primitives": "0.0.2-beta.1",
    "unplugin-icons": "^0.19.3",
    vite: "^5.4.11",
    "vite-plugin-inspect": "^0.8.7",
    vitest: "^2.1.5"
  },
  pnpm: {
    patchedDependencies: {
      "@crxjs/vite-plugin@2.0.0-beta.21": "patches/@crxjs__vite-plugin@2.0.0-beta.21.patch",
      "@unocss/vite": "patches/@unocss__vite.patch"
    },
    overrides: {
      "es-module-lexer": "^1.5.4"
    }
  }
};

// src/manifest.ts
import { defineManifest } from "file:///Users/prestoncook/Desktop/UT-Registration-Plus/node_modules/.pnpm/@crxjs+vite-plugin@2.0.0-beta.21_patch_hash=xq4uab3o3kbvv4gixvawl2aj5q/node_modules/@crxjs/vite-plugin/dist/index.mjs";
var [major, minor, patch, label = "0"] = package_default.version.replace(/[^\d.-]+/g, "").split(/[.-]/);
var isBeta = !!process.env.BETA;
var mode = isBeta ? "beta" : process.env.NODE_ENV;
if (isBeta && process.env.NODE_ENV !== "production") throw new Error("Cannot have beta non-production build");
var nameSuffix = isBeta ? " (beta)" : mode === "development" ? " (dev)" : "";
var HOST_PERMISSIONS = [
  "*://*.utdirect.utexas.edu/apps/registrar/course_schedule/*",
  "*://*.utdirect.utexas.edu/registration/classlist/*",
  "*://*.utexas.collegescheduler.com/*",
  "*://*.catalog.utexas.edu/ribbit/",
  "*://*.registrar.utexas.edu/schedules/*",
  "*://*.login.utexas.edu/login/*",
  "https://utexas.bluera.com/*",
  "*://my.utexas.edu/student/student/*"
];
var manifest = defineManifest(async () => ({
  manifest_version: 3,
  name: `${package_default.displayName ?? package_default.name}${nameSuffix}`,
  version: `${major}.${minor}.${patch}.${label}`,
  description: package_default.description,
  options_page: "src/pages/options/index.html",
  background: { service_worker: "src/pages/background/background.ts" },
  permissions: ["storage", "unlimitedStorage", "background", "scripting"],
  host_permissions: process.env.MODE === "development" ? [...HOST_PERMISSIONS, "<all_urls>"] : HOST_PERMISSIONS,
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: `icons/icon_${mode}_32.png`
  },
  icons: {
    "16": `icons/icon_${mode}_16.png`,
    "32": `icons/icon_${mode}_32.png`,
    "48": `icons/icon_${mode}_48.png`,
    "128": `icons/icon_${mode}_128.png`
  },
  content_scripts: [
    {
      matches: HOST_PERMISSIONS,
      js: ["src/pages/content/index.tsx"]
    }
  ],
  web_accessible_resources: [
    {
      resources: ["assets/js/*.js", "assets/css/*.css", "assets/img/*"],
      matches: ["*://*/*"]
    }
  ],
  content_security_policy: {
    extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
  }
}));
var manifest_default = manifest;

// utils/plugins/run-command-on-demand.ts
import chalk from "file:///Users/prestoncook/Desktop/UT-Registration-Plus/node_modules/.pnpm/chalk@5.3.0/node_modules/chalk/source/index.js";
import { exec } from "child_process";
var pluginName = "vite-plugin-run-command-on-demand";
var log = (message) => console.log(chalk.blue(`
[${pluginName}]`), chalk.green(message));
var logError = (message) => console.error(chalk.blue(`
[${pluginName}]`), chalk.red(message));
var runCommand = (command) => new Promise((resolve2, reject) => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      logError(`Error executing command: ${command}
${stderr}`);
      reject(error);
    } else {
      log(`Command executed successfully: ${command}
${stdout}`);
      resolve2();
    }
  });
});
var executeCommand = async (command, errorMessage) => {
  if (command) {
    try {
      await runCommand(command);
    } catch {
      logError(errorMessage);
    }
  }
};
function customCommandsPlugin(options = {}) {
  return {
    name: pluginName,
    configureServer(server) {
      server.httpServer?.once("listening", async () => {
        await executeCommand(
          options.beforeServerStart,
          `Error running beforeServerStart command: ${options.beforeServerStart}`
        );
        await executeCommand(
          options.afterServerStart,
          `Error running afterServerStart command: ${options.afterServerStart}`
        );
      });
    },
    async handleHotUpdate(ctx) {
      const isPageReload = ctx.modules.some((module) => !module.isSelfAccepting);
      if (!isPageReload) {
        await executeCommand(options.onHotUpdate, `Error running onHotUpdate command: ${options.onHotUpdate}`);
      }
      return ctx.modules;
    },
    async buildStart() {
      await executeCommand(options.beforeBuild, `Error running beforeBuild command: ${options.beforeBuild}`);
    },
    async buildEnd() {
      await executeCommand(options.afterBuild, `Error running afterBuild command: ${options.afterBuild}`);
    },
    async closeBundle() {
      await executeCommand(options.closeBundle, `Error running closeBundle command: ${options.closeBundle}`);
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "/Users/prestoncook/Desktop/UT-Registration-Plus";
var root = resolve(__vite_injected_original_dirname, "src");
var pagesDir = resolve(root, "pages");
var assetsDir = resolve(root, "assets");
var publicDir = resolve(__vite_injected_original_dirname, "public");
var isBeta2 = !!process.env.BETA;
if (isBeta2) {
  process.env.VITE_BETA_BUILD = "true";
}
process.env.VITE_PACKAGE_VERSION = package_default.version;
if (process.env.PROD) {
  process.env.VITE_SENTRY_ENVIRONMENT = "production";
} else if (isBeta2) {
  process.env.VITE_SENTRY_ENVIRONMENT = "beta";
} else {
  process.env.VITE_SENTRY_ENVIRONMENT = "development";
}
var preambleCode = `
import RefreshRuntime from "__BASE__@react-refresh"
RefreshRuntime.injectIntoGlobalHook(window)
window.$RefreshReg$ = () => {}
window.$RefreshSig$ = () => (type) => type
window.__vite_plugin_react_preamble_installed__ = true
`;
var isOutputChunk = (input) => "code" in input;
var renameFile = (source, destination) => {
  if (typeof source !== "string" || typeof destination !== "string") {
    throw new Error("Invalid arguments for renameFile");
  }
  return {
    name: "crx:rename-file",
    apply: "build",
    enforce: "post",
    generateBundle(options, bundle) {
      const file = bundle[source];
      if (!file) return;
      file.fileName = destination;
    }
  };
};
var fixManifestOptionsPage = () => ({
  name: "fix-manifest-options-page",
  apply: "build",
  enforce: "post",
  generateBundle(_, bundle) {
    for (const fileName of Object.keys(bundle)) {
      if (fileName.startsWith("assets/crx-manifest")) {
        const chunk = bundle[fileName];
        if (!chunk) continue;
        if (isOutputChunk(chunk)) {
          chunk.code = chunk.code.replace(
            /"options_page":"src\/pages\/options\/index.html"/,
            `"options_page":"options.html"`
          );
          return;
        }
      }
    }
  }
});
var vite_config_default = defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    Icons({ compiler: "jsx", jsx: "react" }),
    crx({ manifest: manifest_default }),
    fixManifestOptionsPage(),
    inspect(),
    {
      name: "public-transform",
      apply: "serve",
      transform(code, id) {
        if (id.endsWith(".tsx") || id.endsWith(".ts") || id.endsWith("?url")) {
          return {
            code: code.replace(
              /(['"])(\/public\/.*?)(['"])/g,
              (_, quote1, path, quote2) => `chrome.runtime.getURL(${quote1}${path}${quote2})`
            ),
            map: null
          };
        }
      }
    },
    {
      name: "public-transform",
      apply: "build",
      transform(code, id) {
        if (id.endsWith(".tsx") || id.endsWith(".ts") || id.endsWith("?url")) {
          return {
            code: code.replace(
              /(['"])(__VITE_ASSET__.*?__)(['"])/g,
              (_, quote1, path, quote2) => `chrome.runtime.getURL(${quote1}${path}${quote2})`
            ),
            map: null
          };
        }
      }
    },
    {
      name: "public-css-dev-transform",
      apply: "serve",
      enforce: "post",
      transform(code, id) {
        if (process.env.NODE_ENV === "development" && (id.endsWith(".css") || id.endsWith(".scss"))) {
          return {
            code: code.replace(
              /url\((.*?)\)/g,
              (_, path) => `url(\\"" + chrome.runtime.getURL(${path.replaceAll(`\\"`, `"`).replace(/public\//, "")}) + "\\")`
            ),
            map: null
          };
        }
      }
    },
    {
      name: "public-transform2",
      // enforce: 'post',
      transform(code, id) {
        if (id.replace(/\?used$/, "").endsWith(".scss")) {
          const transformedCode = code.replace(
            /(__VITE_ASSET__.*?__)/g,
            (_, path) => `chrome-extension://__MSG_@@extension_id__${path}`
          );
          return { code: transformedCode, map: null };
        }
      }
    },
    renameFile("src/pages/debug/index.html", "debug.html"),
    renameFile("src/pages/options/index.html", "options.html"),
    renameFile("src/pages/calendar/index.html", "calendar.html"),
    renameFile("src/pages/report/index.html", "report.html"),
    renameFile("src/pages/404/index.html", "404.html"),
    customCommandsPlugin({
      // afterServerStart: 'pnpm gulp forceDisableUseDynamicUrl',
      closeBundle: "pnpm gulp forceDisableUseDynamicUrl"
    })
  ],
  resolve: {
    alias: {
      src: root,
      "@assets": assetsDir,
      "@pages": pagesDir,
      "@public": publicDir,
      "@shared": resolve(root, "shared"),
      "@background": resolve(pagesDir, "background"),
      "@views": resolve(root, "views")
    }
  },
  server: {
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 5173
    },
    proxy: {
      "/debug.html": {
        target: "http://localhost:5173",
        rewrite: (path) => path.replace("debug", "src/pages/debug/index")
      },
      "/calendar.html": {
        target: "http://localhost:5173",
        rewrite: (path) => path.replace("calendar", "src/pages/calendar/index")
      },
      "/options.html": {
        target: "http://localhost:5173",
        rewrite: (path) => path.replace("options", "src/pages/options/index")
      },
      "/report.html": {
        target: "http://localhost:5173",
        rewrite: (path) => path.replace("report", "src/pages/report/index")
      },
      "/404.html": {
        target: "http://localhost:5173",
        rewrite: (path) => path.replace("404", "src/pages/404/index")
      }
    }
  },
  build: {
    target: ["chrome120", "edge120", "firefox120"],
    emptyOutDir: true,
    reportCompressedSize: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        debug: "src/pages/debug/index.html",
        calendar: "src/pages/calendar/index.html",
        options: "src/pages/options/index.html",
        report: "src/pages/report/index.html",
        404: "src/pages/404/index.html"
      },
      output: {
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash][extname]`
      }
    }
  },
  test: {
    coverage: {
      provider: "v8"
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  }
});
export {
  vite_config_default as default,
  preambleCode
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIiwgInNyYy9tYW5pZmVzdC50cyIsICJ1dGlscy9wbHVnaW5zL3J1bi1jb21tYW5kLW9uLWRlbWFuZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9wcmVzdG9uY29vay9EZXNrdG9wL1VULVJlZ2lzdHJhdGlvbi1QbHVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvcHJlc3RvbmNvb2svRGVza3RvcC9VVC1SZWdpc3RyYXRpb24tUGx1cy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcHJlc3RvbmNvb2svRGVza3RvcC9VVC1SZWdpc3RyYXRpb24tUGx1cy92aXRlLmNvbmZpZy50c1wiOy8vLyA8cmVmZXJlbmNlIHR5cGVzPVwidml0ZXN0XCIgLz5cbmltcG9ydCB7IGNyeCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbic7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnO1xuaW1wb3J0IHR5cGUgeyBQbHVnaW4sIFJlc29sdmVkQ29uZmlnLCBSb2xsdXAsIFZpdGVEZXZTZXJ2ZXIgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGluc3BlY3QgZnJvbSAndml0ZS1wbHVnaW4taW5zcGVjdCc7XG5cbmltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuL3BhY2thZ2UuanNvbic7XG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9zcmMvbWFuaWZlc3QnO1xuaW1wb3J0IHZpdGVQbHVnaW5SdW5Db21tYW5kT25EZW1hbmQgZnJvbSAnLi91dGlscy9wbHVnaW5zL3J1bi1jb21tYW5kLW9uLWRlbWFuZCc7XG5cbmNvbnN0IHJvb3QgPSByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpO1xuY29uc3QgcGFnZXNEaXIgPSByZXNvbHZlKHJvb3QsICdwYWdlcycpO1xuY29uc3QgYXNzZXRzRGlyID0gcmVzb2x2ZShyb290LCAnYXNzZXRzJyk7XG5jb25zdCBwdWJsaWNEaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgJ3B1YmxpYycpO1xuXG5jb25zdCBpc0JldGEgPSAhIXByb2Nlc3MuZW52LkJFVEE7XG5pZiAoaXNCZXRhKSB7XG4gICAgcHJvY2Vzcy5lbnYuVklURV9CRVRBX0JVSUxEID0gJ3RydWUnO1xufVxucHJvY2Vzcy5lbnYuVklURV9QQUNLQUdFX1ZFUlNJT04gPSBwYWNrYWdlSnNvbi52ZXJzaW9uO1xuaWYgKHByb2Nlc3MuZW52LlBST0QpIHtcbiAgICBwcm9jZXNzLmVudi5WSVRFX1NFTlRSWV9FTlZJUk9OTUVOVCA9ICdwcm9kdWN0aW9uJztcbn0gZWxzZSBpZiAoaXNCZXRhKSB7XG4gICAgcHJvY2Vzcy5lbnYuVklURV9TRU5UUllfRU5WSVJPTk1FTlQgPSAnYmV0YSc7XG59IGVsc2Uge1xuICAgIHByb2Nlc3MuZW52LlZJVEVfU0VOVFJZX0VOVklST05NRU5UID0gJ2RldmVsb3BtZW50Jztcbn1cblxuZXhwb3J0IGNvbnN0IHByZWFtYmxlQ29kZSA9IGBcbmltcG9ydCBSZWZyZXNoUnVudGltZSBmcm9tIFwiX19CQVNFX19AcmVhY3QtcmVmcmVzaFwiXG5SZWZyZXNoUnVudGltZS5pbmplY3RJbnRvR2xvYmFsSG9vayh3aW5kb3cpXG53aW5kb3cuJFJlZnJlc2hSZWckID0gKCkgPT4ge31cbndpbmRvdy4kUmVmcmVzaFNpZyQgPSAoKSA9PiAodHlwZSkgPT4gdHlwZVxud2luZG93Ll9fdml0ZV9wbHVnaW5fcmVhY3RfcHJlYW1ibGVfaW5zdGFsbGVkX18gPSB0cnVlXG5gO1xuXG5jb25zdCBpc091dHB1dENodW5rID0gKGlucHV0OiBSb2xsdXAuT3V0cHV0QXNzZXQgfCBSb2xsdXAuT3V0cHV0Q2h1bmspOiBpbnB1dCBpcyBSb2xsdXAuT3V0cHV0Q2h1bmsgPT4gJ2NvZGUnIGluIGlucHV0O1xuXG5jb25zdCByZW5hbWVGaWxlID0gKHNvdXJjZTogc3RyaW5nLCBkZXN0aW5hdGlvbjogc3RyaW5nKTogUGx1Z2luID0+IHtcbiAgICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ3N0cmluZycgfHwgdHlwZW9mIGRlc3RpbmF0aW9uICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzIGZvciByZW5hbWVGaWxlJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbmFtZTogJ2NyeDpyZW5hbWUtZmlsZScsXG4gICAgICAgIGFwcGx5OiAnYnVpbGQnLFxuICAgICAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgICAgIGdlbmVyYXRlQnVuZGxlKG9wdGlvbnMsIGJ1bmRsZSkge1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IGJ1bmRsZVtzb3VyY2VdO1xuICAgICAgICAgICAgaWYgKCFmaWxlKSByZXR1cm47XG4gICAgICAgICAgICBmaWxlLmZpbGVOYW1lID0gZGVzdGluYXRpb247XG4gICAgICAgIH0sXG4gICAgfTtcbn07XG5cbmNvbnN0IGZpeE1hbmlmZXN0T3B0aW9uc1BhZ2UgPSAoKTogUGx1Z2luID0+ICh7XG4gICAgbmFtZTogJ2ZpeC1tYW5pZmVzdC1vcHRpb25zLXBhZ2UnLFxuICAgIGFwcGx5OiAnYnVpbGQnLFxuICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICBnZW5lcmF0ZUJ1bmRsZShfLCBidW5kbGUpIHtcbiAgICAgICAgZm9yIChjb25zdCBmaWxlTmFtZSBvZiBPYmplY3Qua2V5cyhidW5kbGUpKSB7XG4gICAgICAgICAgICBpZiAoZmlsZU5hbWUuc3RhcnRzV2l0aCgnYXNzZXRzL2NyeC1tYW5pZmVzdCcpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2h1bmsgPSBidW5kbGVbZmlsZU5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICghY2h1bmspIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzT3V0cHV0Q2h1bmsoY2h1bmspKSB7XG4gICAgICAgICAgICAgICAgICAgIGNodW5rLmNvZGUgPSBjaHVuay5jb2RlLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAvXCJvcHRpb25zX3BhZ2VcIjpcInNyY1xcL3BhZ2VzXFwvb3B0aW9uc1xcL2luZGV4Lmh0bWxcIi8sXG4gICAgICAgICAgICAgICAgICAgICAgICBgXCJvcHRpb25zX3BhZ2VcIjpcIm9wdGlvbnMuaHRtbFwiYFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbn0pO1xuXG5sZXQgY29uZmlnOiBSZXNvbHZlZENvbmZpZztcbmxldCBzZXJ2ZXI6IFZpdGVEZXZTZXJ2ZXI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgVW5vQ1NTKCksXG4gICAgICAgIEljb25zKHsgY29tcGlsZXI6ICdqc3gnLCBqc3g6ICdyZWFjdCcgfSksXG4gICAgICAgIGNyeCh7IG1hbmlmZXN0IH0pLFxuICAgICAgICBmaXhNYW5pZmVzdE9wdGlvbnNQYWdlKCksXG4gICAgICAgIGluc3BlY3QoKSxcbiAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ3B1YmxpYy10cmFuc2Zvcm0nLFxuICAgICAgICAgICAgYXBwbHk6ICdzZXJ2ZScsXG4gICAgICAgICAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaWQuZW5kc1dpdGgoJy50c3gnKSB8fCBpZC5lbmRzV2l0aCgnLnRzJykgfHwgaWQuZW5kc1dpdGgoJz91cmwnKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY29kZS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8oWydcIl0pKFxcL3B1YmxpY1xcLy4qPykoWydcIl0pL2csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF8sIHF1b3RlMSwgcGF0aCwgcXVvdGUyKSA9PiBgY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKCR7cXVvdGUxfSR7cGF0aH0ke3F1b3RlMn0pYFxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncHVibGljLXRyYW5zZm9ybScsXG4gICAgICAgICAgICBhcHBseTogJ2J1aWxkJyxcbiAgICAgICAgICAgIHRyYW5zZm9ybShjb2RlLCBpZCkge1xuICAgICAgICAgICAgICAgIGlmIChpZC5lbmRzV2l0aCgnLnRzeCcpIHx8IGlkLmVuZHNXaXRoKCcudHMnKSB8fCBpZC5lbmRzV2l0aCgnP3VybCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBjb2RlLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyhbJ1wiXSkoX19WSVRFX0FTU0VUX18uKj9fXykoWydcIl0pL2csXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF8sIHF1b3RlMSwgcGF0aCwgcXVvdGUyKSA9PiBgY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKCR7cXVvdGUxfSR7cGF0aH0ke3F1b3RlMn0pYFxuICAgICAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAncHVibGljLWNzcy1kZXYtdHJhbnNmb3JtJyxcbiAgICAgICAgICAgIGFwcGx5OiAnc2VydmUnLFxuICAgICAgICAgICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgICAgICAgICAgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnICYmIChpZC5lbmRzV2l0aCgnLmNzcycpIHx8IGlkLmVuZHNXaXRoKCcuc2NzcycpKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY29kZS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC91cmxcXCgoLio/KVxcKS9nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfLCBwYXRoKSA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgdXJsKFxcXFxcIlwiICsgY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKCR7cGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2VBbGwoYFxcXFxcImAsIGBcImApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvcHVibGljXFwvLywgJycpfSkgKyBcIlxcXFxcIilgXG4gICAgICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdwdWJsaWMtdHJhbnNmb3JtMicsXG4gICAgICAgICAgICAvLyBlbmZvcmNlOiAncG9zdCcsXG4gICAgICAgICAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgICAgICAgICAgICBpZiAoaWQucmVwbGFjZSgvXFw/dXNlZCQvLCAnJykuZW5kc1dpdGgoJy5zY3NzJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRDb2RlID0gY29kZS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgLyhfX1ZJVEVfQVNTRVRfXy4qP19fKS9nLFxuICAgICAgICAgICAgICAgICAgICAgICAgKF8sIHBhdGgpID0+IGBjaHJvbWUtZXh0ZW5zaW9uOi8vX19NU0dfQEBleHRlbnNpb25faWRfXyR7cGF0aH1gXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGNvZGU6IHRyYW5zZm9ybWVkQ29kZSwgbWFwOiBudWxsIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVuYW1lRmlsZSgnc3JjL3BhZ2VzL2RlYnVnL2luZGV4Lmh0bWwnLCAnZGVidWcuaHRtbCcpLFxuICAgICAgICByZW5hbWVGaWxlKCdzcmMvcGFnZXMvb3B0aW9ucy9pbmRleC5odG1sJywgJ29wdGlvbnMuaHRtbCcpLFxuICAgICAgICByZW5hbWVGaWxlKCdzcmMvcGFnZXMvY2FsZW5kYXIvaW5kZXguaHRtbCcsICdjYWxlbmRhci5odG1sJyksXG4gICAgICAgIHJlbmFtZUZpbGUoJ3NyYy9wYWdlcy9yZXBvcnQvaW5kZXguaHRtbCcsICdyZXBvcnQuaHRtbCcpLFxuICAgICAgICByZW5hbWVGaWxlKCdzcmMvcGFnZXMvNDA0L2luZGV4Lmh0bWwnLCAnNDA0Lmh0bWwnKSxcbiAgICAgICAgdml0ZVBsdWdpblJ1bkNvbW1hbmRPbkRlbWFuZCh7XG4gICAgICAgICAgICAvLyBhZnRlclNlcnZlclN0YXJ0OiAncG5wbSBndWxwIGZvcmNlRGlzYWJsZVVzZUR5bmFtaWNVcmwnLFxuICAgICAgICAgICAgY2xvc2VCdW5kbGU6ICdwbnBtIGd1bHAgZm9yY2VEaXNhYmxlVXNlRHluYW1pY1VybCcsXG4gICAgICAgIH0pLFxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgc3JjOiByb290LFxuICAgICAgICAgICAgJ0Bhc3NldHMnOiBhc3NldHNEaXIsXG4gICAgICAgICAgICAnQHBhZ2VzJzogcGFnZXNEaXIsXG4gICAgICAgICAgICAnQHB1YmxpYyc6IHB1YmxpY0RpcixcbiAgICAgICAgICAgICdAc2hhcmVkJzogcmVzb2x2ZShyb290LCAnc2hhcmVkJyksXG4gICAgICAgICAgICAnQGJhY2tncm91bmQnOiByZXNvbHZlKHBhZ2VzRGlyLCAnYmFja2dyb3VuZCcpLFxuICAgICAgICAgICAgJ0B2aWV3cyc6IHJlc29sdmUocm9vdCwgJ3ZpZXdzJyksXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgICAgcG9ydDogNTE3MyxcbiAgICAgICAgaG1yOiB7XG4gICAgICAgICAgICBjbGllbnRQb3J0OiA1MTczLFxuICAgICAgICB9LFxuICAgICAgICBwcm94eToge1xuICAgICAgICAgICAgJy9kZWJ1Zy5odG1sJzoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6NTE3MycsXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogcGF0aCA9PiBwYXRoLnJlcGxhY2UoJ2RlYnVnJywgJ3NyYy9wYWdlcy9kZWJ1Zy9pbmRleCcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcvY2FsZW5kYXIuaHRtbCc6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUxNzMnLFxuICAgICAgICAgICAgICAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKCdjYWxlbmRhcicsICdzcmMvcGFnZXMvY2FsZW5kYXIvaW5kZXgnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnL29wdGlvbnMuaHRtbCc6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUxNzMnLFxuICAgICAgICAgICAgICAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKCdvcHRpb25zJywgJ3NyYy9wYWdlcy9vcHRpb25zL2luZGV4JyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJy9yZXBvcnQuaHRtbCc6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdodHRwOi8vbG9jYWxob3N0OjUxNzMnLFxuICAgICAgICAgICAgICAgIHJld3JpdGU6IHBhdGggPT4gcGF0aC5yZXBsYWNlKCdyZXBvcnQnLCAnc3JjL3BhZ2VzL3JlcG9ydC9pbmRleCcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcvNDA0Lmh0bWwnOiB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MTczJyxcbiAgICAgICAgICAgICAgICByZXdyaXRlOiBwYXRoID0+IHBhdGgucmVwbGFjZSgnNDA0JywgJ3NyYy9wYWdlcy80MDQvaW5kZXgnKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgICB0YXJnZXQ6IFsnY2hyb21lMTIwJywgJ2VkZ2UxMjAnLCAnZmlyZWZveDEyMCddLFxuICAgICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGZhbHNlLFxuICAgICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgICAgICAgZGVidWc6ICdzcmMvcGFnZXMvZGVidWcvaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICAgY2FsZW5kYXI6ICdzcmMvcGFnZXMvY2FsZW5kYXIvaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICAgb3B0aW9uczogJ3NyYy9wYWdlcy9vcHRpb25zL2luZGV4Lmh0bWwnLFxuICAgICAgICAgICAgICAgIHJlcG9ydDogJ3NyYy9wYWdlcy9yZXBvcnQvaW5kZXguaHRtbCcsXG4gICAgICAgICAgICAgICAgNDA0OiAnc3JjL3BhZ2VzLzQwNC9pbmRleC5odG1sJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgICAgICBjaHVua0ZpbGVOYW1lczogYGFzc2V0cy9bbmFtZV0tW2hhc2hdLmpzYCxcbiAgICAgICAgICAgICAgICBhc3NldEZpbGVOYW1lczogYGFzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdYCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB0ZXN0OiB7XG4gICAgICAgIGNvdmVyYWdlOiB7XG4gICAgICAgICAgICBwcm92aWRlcjogJ3Y4JyxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuIiwgIntcbiAgICBcIm5hbWVcIjogXCJ1dC1yZWdpc3RyYXRpb24tcGx1c1wiLFxuICAgIFwiZGlzcGxheU5hbWVcIjogXCJVVCBSZWdpc3RyYXRpb24gUGx1c1wiLFxuICAgIFwidmVyc2lvblwiOiBcIjIuMC4yXCIsXG4gICAgXCJkZXNjcmlwdGlvblwiOiBcIlVUIFJlZ2lzdHJhdGlvbiBQbHVzIGlzIGEgQ2hyb21lIGV4dGVuc2lvbiB0aGF0IGFsbG93cyBzdHVkZW50cyB0byBlYXNpbHkgcmVnaXN0ZXIgZm9yIGNsYXNzZXMuXCIsXG4gICAgXCJwcml2YXRlXCI6IHRydWUsXG4gICAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9Mb25naG9ybi1EZXZlbG9wZXJzL1VULVJlZ2lzdHJhdGlvbi1QbHVzXCIsXG4gICAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gICAgXCJzY3JpcHRzXCI6IHtcbiAgICAgICAgXCJkZXZcIjogXCJ2aXRlXCIsXG4gICAgICAgIFwiYnVpbGRcIjogXCJ0c2MgJiYgdml0ZSBidWlsZFwiLFxuICAgICAgICBcImJ1aWxkOndhdGNoXCI6IFwiTk9ERV9FTlY9J2RldmVsb3BtZW50JyB2aXRlIGJ1aWxkIC0tbW9kZSBkZXZlbG9wbWVudCAtd1wiLFxuICAgICAgICBcInppcFwiOiBcIlBST0Q9dHJ1ZSBwbnBtIGJ1aWxkICYmIHBucG0gZ3VscCB6aXBQcm9kQnVpbGRcIixcbiAgICAgICAgXCJwcmV0dGllclwiOiBcInByZXR0aWVyIHNyYyAtLWNoZWNrXCIsXG4gICAgICAgIFwicHJldHRpZXI6Zml4XCI6IFwicHJldHRpZXIgc3JjIC0td3JpdGVcIixcbiAgICAgICAgXCJsaW50XCI6IFwiZXNsaW50IHNyYyAtLWV4dCB0cyx0c3ggLS1yZXBvcnQtdW51c2VkLWRpc2FibGUtZGlyZWN0aXZlc1wiLFxuICAgICAgICBcImxpbnQ6Zml4XCI6IFwiZXNsaW50IHNyYyAtLWV4dCB0cyx0c3ggLS1yZXBvcnQtdW51c2VkLWRpc2FibGUtZGlyZWN0aXZlcyAtLWZpeFwiLFxuICAgICAgICBcImNoZWNrLXR5cGVzXCI6IFwidHNjIC0tbm9FbWl0XCIsXG4gICAgICAgIFwidGVzdFwiOiBcInZpdGVzdFwiLFxuICAgICAgICBcInRlc3Q6dWlcIjogXCJ2aXRlc3QgLS11aVwiLFxuICAgICAgICBcImNvdmVyYWdlXCI6IFwidml0ZXN0IHJ1biAtLWNvdmVyYWdlXCIsXG4gICAgICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiLFxuICAgICAgICBcImdlbmVyYXRlLWNoYW5nZWxvZ1wiOiBcImJ1biBydW4gc2NyaXB0cy9nZW5lcmF0ZUNoYW5nZWxvZy50c1wiLFxuICAgICAgICBcInByZWluc3RhbGxcIjogXCJucHggb25seS1hbGxvdyBwbnBtXCIsXG4gICAgICAgIFwic3Rvcnlib29rXCI6IFwic3Rvcnlib29rIGRldiAtcCA2MDA2XCIsXG4gICAgICAgIFwiYnVpbGQtc3Rvcnlib29rXCI6IFwic3Rvcnlib29rIGJ1aWxkXCIsXG4gICAgICAgIFwicHJlcGFyZVwiOiBcImh1c2t5XCJcbiAgICB9LFxuICAgIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICAgICAgXCJAaGVhZGxlc3N1aS9yZWFjdFwiOiBcIl4yLjIuMFwiLFxuICAgICAgICBcIkBoZWxsby1wYW5nZWEvZG5kXCI6IFwiXjE3LjAuMFwiLFxuICAgICAgICBcIkBvY3Rva2l0L3Jlc3RcIjogXCJeMjEuMC4yXCIsXG4gICAgICAgIFwiQHBob3NwaG9yLWljb25zL3JlYWN0XCI6IFwiXjIuMS43XCIsXG4gICAgICAgIFwiQHNlbnRyeS9yZWFjdFwiOiBcIl44LjM4LjBcIixcbiAgICAgICAgXCJAdW5vY3NzL3ZpdGVcIjogXCJeMC42My42XCIsXG4gICAgICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4zLjNcIixcbiAgICAgICAgXCJjaHJvbWUtZXh0ZW5zaW9uLXRvb2xraXRcIjogXCJeMC4wLjU0XCIsXG4gICAgICAgIFwiY2xzeFwiOiBcIl4yLjEuMVwiLFxuICAgICAgICBcImNvbnZlbnRpb25hbC1jaGFuZ2Vsb2dcIjogXCJeNi4wLjBcIixcbiAgICAgICAgXCJoaWdoY2hhcnRzXCI6IFwiXjExLjQuOFwiLFxuICAgICAgICBcImhpZ2hjaGFydHMtcmVhY3Qtb2ZmaWNpYWxcIjogXCJeMy4yLjFcIixcbiAgICAgICAgXCJodG1sLXRvLWltYWdlXCI6IFwiXjEuMTEuMTFcIixcbiAgICAgICAgXCJodXNreVwiOiBcIl45LjEuNlwiLFxuICAgICAgICBcImtjLWRhYnItd2FzbVwiOiBcIl4wLjEuMlwiLFxuICAgICAgICBcIm5hbm9pZFwiOiBcIl41LjAuOFwiLFxuICAgICAgICBcInJlYWN0XCI6IFwiXjE4LjMuMVwiLFxuICAgICAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4zLjFcIixcbiAgICAgICAgXCJyZWFjdC1sb2FkaW5nLXNrZWxldG9uXCI6IFwiXjMuNS4wXCIsXG4gICAgICAgIFwicmVhY3QtbWFya2Rvd25cIjogXCJeOS4wLjFcIixcbiAgICAgICAgXCJyZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXJcIjogXCJeMTUuNi4xXCIsXG4gICAgICAgIFwicmVtYXJrLWdmbVwiOiBcIl40LjAuMFwiLFxuICAgICAgICBcInNhc3NcIjogXCJeMS44MS4wXCIsXG4gICAgICAgIFwic2ltcGxlLWdpdFwiOiBcIl4zLjI3LjBcIixcbiAgICAgICAgXCJzcWwuanNcIjogXCIxLjExLjBcIlxuICAgIH0sXG4gICAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgICAgICBcIkBjaHJvbWF0aWMtY29tL3N0b3J5Ym9va1wiOiBcIl4yLjAuMlwiLFxuICAgICAgICBcIkBjb21taXRsaW50L2NsaVwiOiBcIl4xOS41LjBcIixcbiAgICAgICAgXCJAY29tbWl0bGludC9jb25maWctY29udmVudGlvbmFsXCI6IFwiXjE5LjUuMFwiLFxuICAgICAgICBcIkBjb21taXRsaW50L3R5cGVzXCI6IFwiXjE5LjUuMFwiLFxuICAgICAgICBcIkBjcnhqcy92aXRlLXBsdWdpblwiOiBcIjIuMC4wLWJldGEuMjFcIixcbiAgICAgICAgXCJAaWNvbmlmeS1qc29uL2JpXCI6IFwiXjEuMi4xXCIsXG4gICAgICAgIFwiQGljb25pZnktanNvbi9pY1wiOiBcIl4xLjIuMVwiLFxuICAgICAgICBcIkBpY29uaWZ5LWpzb24vaWNvbm9pclwiOiBcIl4xLjIuNFwiLFxuICAgICAgICBcIkBpY29uaWZ5LWpzb24vbWF0ZXJpYWwtc3ltYm9sc1wiOiBcIl4xLjIuNlwiLFxuICAgICAgICBcIkBpY29uaWZ5LWpzb24vcmlcIjogXCJeMS4yLjNcIixcbiAgICAgICAgXCJAaWNvbmlmeS1qc29uL3N0cmVhbWxpbmVcIjogXCJeMS4yLjFcIixcbiAgICAgICAgXCJAc2VtYW50aWMtcmVsZWFzZS9leGVjXCI6IFwiXjYuMC4zXCIsXG4gICAgICAgIFwiQHNlbnRyeS90eXBlc1wiOiBcIl44LjM4LjBcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL2FkZG9uLWRlc2lnbnNcIjogXCJeOC4wLjRcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL2FkZG9uLWVzc2VudGlhbHNcIjogXCJeOC40LjRcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL2FkZG9uLWxpbmtzXCI6IFwiXjguNC40XCIsXG4gICAgICAgIFwiQHN0b3J5Ym9vay9ibG9ja3NcIjogXCJeOC40LjRcIixcbiAgICAgICAgXCJAc3Rvcnlib29rL3JlYWN0XCI6IFwiXjguNC40XCIsXG4gICAgICAgIFwiQHN0b3J5Ym9vay9yZWFjdC12aXRlXCI6IFwiXjguNC40XCIsXG4gICAgICAgIFwiQHN0b3J5Ym9vay90ZXN0XCI6IFwiXjguNC40XCIsXG4gICAgICAgIFwiQHN2Z3IvY29yZVwiOiBcIl44LjEuMFwiLFxuICAgICAgICBcIkBzdmdyL3BsdWdpbi1qc3hcIjogXCJeOC4xLjBcIixcbiAgICAgICAgXCJAdHlwZXMvY2hyb21lXCI6IFwiXjAuMC4yNzNcIixcbiAgICAgICAgXCJAdHlwZXMvY29udmVudGlvbmFsLWNoYW5nZWxvZ1wiOiBcIl4zLjEuNVwiLFxuICAgICAgICBcIkB0eXBlcy9ndWxwXCI6IFwiXjQuMC4xN1wiLFxuICAgICAgICBcIkB0eXBlcy9ndWxwLXppcFwiOiBcIl40LjAuNFwiLFxuICAgICAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIyLjkuMFwiLFxuICAgICAgICBcIkB0eXBlcy9wcm9tcHRzXCI6IFwiXjIuNC45XCIsXG4gICAgICAgIFwiQHR5cGVzL3JlYWN0XCI6IFwiXjE4LjMuMTJcIixcbiAgICAgICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjMuMVwiLFxuICAgICAgICBcIkB0eXBlcy9yZWFjdC1zeW50YXgtaGlnaGxpZ2h0ZXJcIjogXCJeMTUuNS4xM1wiLFxuICAgICAgICBcIkB0eXBlcy9zZW1hbnRpYy1yZWxlYXNlXCI6IFwiXjIwLjAuNlwiLFxuICAgICAgICBcIkB0eXBlcy9zZW12ZXJcIjogXCJeNy41LjhcIixcbiAgICAgICAgXCJAdHlwZXMvc3FsLmpzXCI6IFwiXjEuNC45XCIsXG4gICAgICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNy4xOC4wXCIsXG4gICAgICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl43LjE4LjBcIixcbiAgICAgICAgXCJAdW5vY3NzL2VzbGludC1jb25maWdcIjogXCJeMC42My42XCIsXG4gICAgICAgIFwiQHVub2Nzcy9wb3N0Y3NzXCI6IFwiXjAuNjMuNlwiLFxuICAgICAgICBcIkB1bm9jc3MvcHJlc2V0LXVub1wiOiBcIl4wLjYzLjZcIixcbiAgICAgICAgXCJAdW5vY3NzL3ByZXNldC13ZWItZm9udHNcIjogXCJeMC42My42XCIsXG4gICAgICAgIFwiQHVub2Nzcy9yZXNldFwiOiBcIl4wLjYzLjZcIixcbiAgICAgICAgXCJAdW5vY3NzL3RyYW5zZm9ybWVyLWRpcmVjdGl2ZXNcIjogXCJeMC42My42XCIsXG4gICAgICAgIFwiQHVub2Nzcy90cmFuc2Zvcm1lci12YXJpYW50LWdyb3VwXCI6IFwiXjAuNjMuNlwiLFxuICAgICAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjcuMVwiLFxuICAgICAgICBcIkB2aXRlc3QvY292ZXJhZ2UtdjhcIjogXCJeMi4xLjVcIixcbiAgICAgICAgXCJAdml0ZXN0L3VpXCI6IFwiXjIuMS41XCIsXG4gICAgICAgIFwiY2hhbGtcIjogXCJeNS4zLjBcIixcbiAgICAgICAgXCJjaHJvbWF0aWNcIjogXCJeMTEuMTguMVwiLFxuICAgICAgICBcImNzc25hbm9cIjogXCJeNy4wLjZcIixcbiAgICAgICAgXCJjc3NuYW5vLXByZXNldC1hZHZhbmNlZFwiOiBcIl43LjAuNlwiLFxuICAgICAgICBcImRvdGVudlwiOiBcIl4xNi40LjVcIixcbiAgICAgICAgXCJlcy1tb2R1bGUtbGV4ZXJcIjogXCJeMS41LjRcIixcbiAgICAgICAgXCJlc2xpbnRcIjogXCJeOC41Ny4xXCIsXG4gICAgICAgIFwiZXNsaW50LWNvbmZpZy1haXJibmJcIjogXCJeMTkuMC40XCIsXG4gICAgICAgIFwiZXNsaW50LWNvbmZpZy1haXJibmItYmFzZVwiOiBcIl4xNS4wLjBcIixcbiAgICAgICAgXCJlc2xpbnQtY29uZmlnLWFpcmJuYi10eXBlc2NyaXB0XCI6IFwiXjE4LjAuMFwiLFxuICAgICAgICBcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeOS4xLjBcIixcbiAgICAgICAgXCJlc2xpbnQtaW1wb3J0LXJlc29sdmVyLXR5cGVzY3JpcHRcIjogXCJeMy42LjNcIixcbiAgICAgICAgXCJlc2xpbnQtcGx1Z2luLWltcG9ydFwiOiBcIl4yLjMxLjBcIixcbiAgICAgICAgXCJlc2xpbnQtcGx1Z2luLWltcG9ydC1lc3NlbnRpYWxzXCI6IFwiXjAuMi4xXCIsXG4gICAgICAgIFwiZXNsaW50LXBsdWdpbi1qc2RvY1wiOiBcIl41MC41LjBcIixcbiAgICAgICAgXCJlc2xpbnQtcGx1Z2luLXByZXR0aWVyXCI6IFwiXjUuMi4xXCIsXG4gICAgICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdFwiOiBcIl43LjM3LjJcIixcbiAgICAgICAgXCJlc2xpbnQtcGx1Z2luLXJlYWN0LWhvb2tzXCI6IFwiXjQuNi4yXCIsXG4gICAgICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1wcmVmZXItZnVuY3Rpb24tY29tcG9uZW50XCI6IFwiXjMuMy4wXCIsXG4gICAgICAgIFwiZXNsaW50LXBsdWdpbi1yZWFjdC1yZWZyZXNoXCI6IFwiXjAuNC4xNFwiLFxuICAgICAgICBcImVzbGludC1wbHVnaW4tc2ltcGxlLWltcG9ydC1zb3J0XCI6IFwiXjEyLjEuMVwiLFxuICAgICAgICBcImVzbGludC1wbHVnaW4tc3Rvcnlib29rXCI6IFwiXjAuOS4wXCIsXG4gICAgICAgIFwiZXNsaW50LXBsdWdpbi10c2RvY1wiOiBcIl4wLjMuMFwiLFxuICAgICAgICBcImd1bHBcIjogXCJeNS4wLjBcIixcbiAgICAgICAgXCJndWxwLWV4ZWNhXCI6IFwiXjcuMC4xXCIsXG4gICAgICAgIFwiZ3VscC16aXBcIjogXCJeNi4wLjBcIixcbiAgICAgICAgXCJwYXRoXCI6IFwiXjAuMTIuN1wiLFxuICAgICAgICBcInBvc3Rjc3NcIjogXCJeOC40LjQ5XCIsXG4gICAgICAgIFwicHJldHRpZXJcIjogXCJeMy4zLjNcIixcbiAgICAgICAgXCJyZWFjdC1kZXYtdXRpbHNcIjogXCJeMTIuMC4xXCIsXG4gICAgICAgIFwic2VtYW50aWMtcmVsZWFzZVwiOiBcIl4yNC4yLjBcIixcbiAgICAgICAgXCJzdG9yeWJvb2tcIjogXCJeOC40LjRcIixcbiAgICAgICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuNi4zXCIsXG4gICAgICAgIFwidW5vY3NzXCI6IFwiXjAuNjMuNlwiLFxuICAgICAgICBcInVub2Nzcy1wcmVzZXQtcHJpbWl0aXZlc1wiOiBcIjAuMC4yLWJldGEuMVwiLFxuICAgICAgICBcInVucGx1Z2luLWljb25zXCI6IFwiXjAuMTkuM1wiLFxuICAgICAgICBcInZpdGVcIjogXCJeNS40LjExXCIsXG4gICAgICAgIFwidml0ZS1wbHVnaW4taW5zcGVjdFwiOiBcIl4wLjguN1wiLFxuICAgICAgICBcInZpdGVzdFwiOiBcIl4yLjEuNVwiXG4gICAgfSxcbiAgICBcInBucG1cIjoge1xuICAgICAgICBcInBhdGNoZWREZXBlbmRlbmNpZXNcIjoge1xuICAgICAgICAgICAgXCJAY3J4anMvdml0ZS1wbHVnaW5AMi4wLjAtYmV0YS4yMVwiOiBcInBhdGNoZXMvQGNyeGpzX192aXRlLXBsdWdpbkAyLjAuMC1iZXRhLjIxLnBhdGNoXCIsXG4gICAgICAgICAgICBcIkB1bm9jc3Mvdml0ZVwiOiBcInBhdGNoZXMvQHVub2Nzc19fdml0ZS5wYXRjaFwiXG4gICAgICAgIH0sXG4gICAgICAgIFwib3ZlcnJpZGVzXCI6IHtcbiAgICAgICAgICAgIFwiZXMtbW9kdWxlLWxleGVyXCI6IFwiXjEuNS40XCJcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3ByZXN0b25jb29rL0Rlc2t0b3AvVVQtUmVnaXN0cmF0aW9uLVBsdXMvc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvcHJlc3RvbmNvb2svRGVza3RvcC9VVC1SZWdpc3RyYXRpb24tUGx1cy9zcmMvbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3ByZXN0b25jb29rL0Rlc2t0b3AvVVQtUmVnaXN0cmF0aW9uLVBsdXMvc3JjL21hbmlmZXN0LnRzXCI7aW1wb3J0IHsgZGVmaW5lTWFuaWZlc3QgfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nO1xuXG5pbXBvcnQgcGFja2FnZUpzb24gZnJvbSAnLi4vcGFja2FnZS5qc29uJztcblxuLy8gQ29udmVydCBmcm9tIFNlbXZlciAoZXhhbXBsZTogMC4xLjAtYmV0YTYpXG5jb25zdCBbbWFqb3IsIG1pbm9yLCBwYXRjaCwgbGFiZWwgPSAnMCddID0gcGFja2FnZUpzb24udmVyc2lvblxuICAgIC8vIGNhbiBvbmx5IGNvbnRhaW4gZGlnaXRzLCBkb3RzLCBvciBkYXNoXG4gICAgLnJlcGxhY2UoL1teXFxkLi1dKy9nLCAnJylcbiAgICAvLyBzcGxpdCBpbnRvIHZlcnNpb24gcGFydHNcbiAgICAuc3BsaXQoL1suLV0vKTtcblxuY29uc3QgaXNCZXRhID0gISFwcm9jZXNzLmVudi5CRVRBO1xuY29uc3QgbW9kZSA9IGlzQmV0YSA/ICdiZXRhJyA6IHByb2Nlc3MuZW52Lk5PREVfRU5WO1xuXG5pZiAoaXNCZXRhICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGhhdmUgYmV0YSBub24tcHJvZHVjdGlvbiBidWlsZCcpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5XG5jb25zdCBuYW1lU3VmZml4ID0gaXNCZXRhID8gJyAoYmV0YSknIDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyA/ICcgKGRldiknIDogJyc7XG5cbmNvbnN0IEhPU1RfUEVSTUlTU0lPTlM6IHN0cmluZ1tdID0gW1xuICAgICcqOi8vKi51dGRpcmVjdC51dGV4YXMuZWR1L2FwcHMvcmVnaXN0cmFyL2NvdXJzZV9zY2hlZHVsZS8qJyxcbiAgICAnKjovLyoudXRkaXJlY3QudXRleGFzLmVkdS9yZWdpc3RyYXRpb24vY2xhc3NsaXN0LyonLFxuICAgICcqOi8vKi51dGV4YXMuY29sbGVnZXNjaGVkdWxlci5jb20vKicsXG4gICAgJyo6Ly8qLmNhdGFsb2cudXRleGFzLmVkdS9yaWJiaXQvJyxcbiAgICAnKjovLyoucmVnaXN0cmFyLnV0ZXhhcy5lZHUvc2NoZWR1bGVzLyonLFxuICAgICcqOi8vKi5sb2dpbi51dGV4YXMuZWR1L2xvZ2luLyonLFxuICAgICdodHRwczovL3V0ZXhhcy5ibHVlcmEuY29tLyonLFxuICAgICcqOi8vbXkudXRleGFzLmVkdS9zdHVkZW50L3N0dWRlbnQvKicsXG5dO1xuXG5jb25zdCBtYW5pZmVzdCA9IGRlZmluZU1hbmlmZXN0KGFzeW5jICgpID0+ICh7XG4gICAgbWFuaWZlc3RfdmVyc2lvbjogMyxcbiAgICBuYW1lOiBgJHtwYWNrYWdlSnNvbi5kaXNwbGF5TmFtZSA/PyBwYWNrYWdlSnNvbi5uYW1lfSR7bmFtZVN1ZmZpeH1gLFxuICAgIHZlcnNpb246IGAke21ham9yfS4ke21pbm9yfS4ke3BhdGNofS4ke2xhYmVsfWAsXG4gICAgZGVzY3JpcHRpb246IHBhY2thZ2VKc29uLmRlc2NyaXB0aW9uLFxuICAgIG9wdGlvbnNfcGFnZTogJ3NyYy9wYWdlcy9vcHRpb25zL2luZGV4Lmh0bWwnLFxuICAgIGJhY2tncm91bmQ6IHsgc2VydmljZV93b3JrZXI6ICdzcmMvcGFnZXMvYmFja2dyb3VuZC9iYWNrZ3JvdW5kLnRzJyB9LFxuICAgIHBlcm1pc3Npb25zOiBbJ3N0b3JhZ2UnLCAndW5saW1pdGVkU3RvcmFnZScsICdiYWNrZ3JvdW5kJywgJ3NjcmlwdGluZyddLFxuICAgIGhvc3RfcGVybWlzc2lvbnM6IHByb2Nlc3MuZW52Lk1PREUgPT09ICdkZXZlbG9wbWVudCcgPyBbLi4uSE9TVF9QRVJNSVNTSU9OUywgJzxhbGxfdXJscz4nXSA6IEhPU1RfUEVSTUlTU0lPTlMsXG4gICAgYWN0aW9uOiB7XG4gICAgICAgIGRlZmF1bHRfcG9wdXA6ICdzcmMvcGFnZXMvcG9wdXAvaW5kZXguaHRtbCcsXG4gICAgICAgIGRlZmF1bHRfaWNvbjogYGljb25zL2ljb25fJHttb2RlfV8zMi5wbmdgLFxuICAgIH0sXG4gICAgaWNvbnM6IHtcbiAgICAgICAgJzE2JzogYGljb25zL2ljb25fJHttb2RlfV8xNi5wbmdgLFxuICAgICAgICAnMzInOiBgaWNvbnMvaWNvbl8ke21vZGV9XzMyLnBuZ2AsXG4gICAgICAgICc0OCc6IGBpY29ucy9pY29uXyR7bW9kZX1fNDgucG5nYCxcbiAgICAgICAgJzEyOCc6IGBpY29ucy9pY29uXyR7bW9kZX1fMTI4LnBuZ2AsXG4gICAgfSxcbiAgICBjb250ZW50X3NjcmlwdHM6IFtcbiAgICAgICAge1xuICAgICAgICAgICAgbWF0Y2hlczogSE9TVF9QRVJNSVNTSU9OUyxcbiAgICAgICAgICAgIGpzOiBbJ3NyYy9wYWdlcy9jb250ZW50L2luZGV4LnRzeCddLFxuICAgICAgICB9LFxuICAgIF0sXG4gICAgd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIHJlc291cmNlczogWydhc3NldHMvanMvKi5qcycsICdhc3NldHMvY3NzLyouY3NzJywgJ2Fzc2V0cy9pbWcvKiddLFxuICAgICAgICAgICAgbWF0Y2hlczogWycqOi8vKi8qJ10sXG4gICAgICAgIH0sXG4gICAgXSxcbiAgICBjb250ZW50X3NlY3VyaXR5X3BvbGljeToge1xuICAgICAgICBleHRlbnNpb25fcGFnZXM6IFwic2NyaXB0LXNyYyAnc2VsZicgJ3dhc20tdW5zYWZlLWV2YWwnOyBvYmplY3Qtc3JjICdzZWxmJ1wiLFxuICAgIH0sXG59KSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1hbmlmZXN0O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcHJlc3RvbmNvb2svRGVza3RvcC9VVC1SZWdpc3RyYXRpb24tUGx1cy91dGlscy9wbHVnaW5zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvcHJlc3RvbmNvb2svRGVza3RvcC9VVC1SZWdpc3RyYXRpb24tUGx1cy91dGlscy9wbHVnaW5zL3J1bi1jb21tYW5kLW9uLWRlbWFuZC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcHJlc3RvbmNvb2svRGVza3RvcC9VVC1SZWdpc3RyYXRpb24tUGx1cy91dGlscy9wbHVnaW5zL3J1bi1jb21tYW5kLW9uLWRlbWFuZC50c1wiOy8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wbmQyODAvY29tcGxleGl0eS9ibG9iL2FscGhhL3ZpdGUtcGx1Z2lucy92aXRlLXBsdWdpbi1ydW4tY29tbWFuZC1vbi1kZW1hbmQudHNcblxuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCB7IGV4ZWMgfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCB0eXBlIHsgSG1yQ29udGV4dCwgUGx1Z2luIH0gZnJvbSAndml0ZSc7XG5cbmNvbnN0IHBsdWdpbk5hbWUgPSAndml0ZS1wbHVnaW4tcnVuLWNvbW1hbmQtb24tZGVtYW5kJztcblxuY29uc3QgbG9nID0gKG1lc3NhZ2U6IHN0cmluZykgPT4gY29uc29sZS5sb2coY2hhbGsuYmx1ZShgXFxuWyR7cGx1Z2luTmFtZX1dYCksIGNoYWxrLmdyZWVuKG1lc3NhZ2UpKTtcbmNvbnN0IGxvZ0Vycm9yID0gKG1lc3NhZ2U6IHN0cmluZykgPT4gY29uc29sZS5lcnJvcihjaGFsay5ibHVlKGBcXG5bJHtwbHVnaW5OYW1lfV1gKSwgY2hhbGsucmVkKG1lc3NhZ2UpKTtcblxuY29uc3QgcnVuQ29tbWFuZCA9IChjb21tYW5kOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBleGVjKGNvbW1hbmQsIChlcnJvciwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGxvZ0Vycm9yKGBFcnJvciBleGVjdXRpbmcgY29tbWFuZDogJHtjb21tYW5kfVxcbiR7c3RkZXJyfWApO1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZyhgQ29tbWFuZCBleGVjdXRlZCBzdWNjZXNzZnVsbHk6ICR7Y29tbWFuZH1cXG4ke3N0ZG91dH1gKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG50eXBlIEN1c3RvbUNvbW1hbmRzUGx1Z2luT3B0aW9ucyA9IHtcbiAgICBiZWZvcmVTZXJ2ZXJTdGFydD86IHN0cmluZztcbiAgICBhZnRlclNlcnZlclN0YXJ0Pzogc3RyaW5nO1xuICAgIG9uSG90VXBkYXRlPzogc3RyaW5nO1xuICAgIGJlZm9yZUJ1aWxkPzogc3RyaW5nO1xuICAgIGFmdGVyQnVpbGQ/OiBzdHJpbmc7XG4gICAgY2xvc2VCdW5kbGU/OiBzdHJpbmc7XG59O1xuXG5jb25zdCBleGVjdXRlQ29tbWFuZCA9IGFzeW5jIChjb21tYW5kOiBzdHJpbmcgfCB1bmRlZmluZWQsIGVycm9yTWVzc2FnZTogc3RyaW5nKSA9PiB7XG4gICAgaWYgKGNvbW1hbmQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHJ1bkNvbW1hbmQoY29tbWFuZCk7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgbG9nRXJyb3IoZXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGN1c3RvbUNvbW1hbmRzUGx1Z2luKG9wdGlvbnM6IEN1c3RvbUNvbW1hbmRzUGx1Z2luT3B0aW9ucyA9IHt9KTogUGx1Z2luIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBwbHVnaW5OYW1lLFxuICAgICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAgICAgICBzZXJ2ZXIuaHR0cFNlcnZlcj8ub25jZSgnbGlzdGVuaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGF3YWl0IGV4ZWN1dGVDb21tYW5kKFxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmJlZm9yZVNlcnZlclN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICBgRXJyb3IgcnVubmluZyBiZWZvcmVTZXJ2ZXJTdGFydCBjb21tYW5kOiAke29wdGlvbnMuYmVmb3JlU2VydmVyU3RhcnR9YFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYXdhaXQgZXhlY3V0ZUNvbW1hbmQoXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuYWZ0ZXJTZXJ2ZXJTdGFydCxcbiAgICAgICAgICAgICAgICAgICAgYEVycm9yIHJ1bm5pbmcgYWZ0ZXJTZXJ2ZXJTdGFydCBjb21tYW5kOiAke29wdGlvbnMuYWZ0ZXJTZXJ2ZXJTdGFydH1gXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFzeW5jIGhhbmRsZUhvdFVwZGF0ZShjdHg6IEhtckNvbnRleHQpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzUGFnZVJlbG9hZCA9IGN0eC5tb2R1bGVzLnNvbWUobW9kdWxlID0+ICFtb2R1bGUuaXNTZWxmQWNjZXB0aW5nKTtcbiAgICAgICAgICAgIGlmICghaXNQYWdlUmVsb2FkKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgZXhlY3V0ZUNvbW1hbmQob3B0aW9ucy5vbkhvdFVwZGF0ZSwgYEVycm9yIHJ1bm5pbmcgb25Ib3RVcGRhdGUgY29tbWFuZDogJHtvcHRpb25zLm9uSG90VXBkYXRlfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGN0eC5tb2R1bGVzO1xuICAgICAgICB9LFxuXG4gICAgICAgIGFzeW5jIGJ1aWxkU3RhcnQoKSB7XG4gICAgICAgICAgICBhd2FpdCBleGVjdXRlQ29tbWFuZChvcHRpb25zLmJlZm9yZUJ1aWxkLCBgRXJyb3IgcnVubmluZyBiZWZvcmVCdWlsZCBjb21tYW5kOiAke29wdGlvbnMuYmVmb3JlQnVpbGR9YCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXN5bmMgYnVpbGRFbmQoKSB7XG4gICAgICAgICAgICBhd2FpdCBleGVjdXRlQ29tbWFuZChvcHRpb25zLmFmdGVyQnVpbGQsIGBFcnJvciBydW5uaW5nIGFmdGVyQnVpbGQgY29tbWFuZDogJHtvcHRpb25zLmFmdGVyQnVpbGR9YCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgYXN5bmMgY2xvc2VCdW5kbGUoKSB7XG4gICAgICAgICAgICBhd2FpdCBleGVjdXRlQ29tbWFuZChvcHRpb25zLmNsb3NlQnVuZGxlLCBgRXJyb3IgcnVubmluZyBjbG9zZUJ1bmRsZSBjb21tYW5kOiAke29wdGlvbnMuY2xvc2VCdW5kbGV9YCk7XG4gICAgICAgIH0sXG4gICAgfTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLFdBQVc7QUFDcEIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxXQUFXO0FBRWxCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sYUFBYTs7O0FDUnBCO0FBQUEsRUFDSSxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixTQUFXO0FBQUEsRUFDWCxhQUFlO0FBQUEsRUFDZixTQUFXO0FBQUEsRUFDWCxVQUFZO0FBQUEsRUFDWixNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsSUFDUCxLQUFPO0FBQUEsSUFDUCxPQUFTO0FBQUEsSUFDVCxlQUFlO0FBQUEsSUFDZixLQUFPO0FBQUEsSUFDUCxVQUFZO0FBQUEsSUFDWixnQkFBZ0I7QUFBQSxJQUNoQixNQUFRO0FBQUEsSUFDUixZQUFZO0FBQUEsSUFDWixlQUFlO0FBQUEsSUFDZixNQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxVQUFZO0FBQUEsSUFDWixTQUFXO0FBQUEsSUFDWCxzQkFBc0I7QUFBQSxJQUN0QixZQUFjO0FBQUEsSUFDZCxXQUFhO0FBQUEsSUFDYixtQkFBbUI7QUFBQSxJQUNuQixTQUFXO0FBQUEsRUFDZjtBQUFBLEVBQ0EsY0FBZ0I7QUFBQSxJQUNaLHFCQUFxQjtBQUFBLElBQ3JCLHFCQUFxQjtBQUFBLElBQ3JCLGlCQUFpQjtBQUFBLElBQ2pCLHlCQUF5QjtBQUFBLElBQ3pCLGlCQUFpQjtBQUFBLElBQ2pCLGdCQUFnQjtBQUFBLElBQ2hCLHdCQUF3QjtBQUFBLElBQ3hCLDRCQUE0QjtBQUFBLElBQzVCLE1BQVE7QUFBQSxJQUNSLDBCQUEwQjtBQUFBLElBQzFCLFlBQWM7QUFBQSxJQUNkLDZCQUE2QjtBQUFBLElBQzdCLGlCQUFpQjtBQUFBLElBQ2pCLE9BQVM7QUFBQSxJQUNULGdC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VUFBVSxRQUFRLE1BQU0sT0FBTztBQUFBLElBQ25DO0FBQUEsRUFDSjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ0osWUFBWTtBQUFBLElBQ1osTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0QsWUFBWTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDSCxlQUFlO0FBQUEsUUFDWCxRQUFRO0FBQUEsUUFDUixTQUFTLFVBQVEsS0FBSyxRQUFRLFNBQVMsdUJBQXVCO0FBQUEsTUFDbEU7QUFBQSxNQUNBLGtCQUFrQjtBQUFBLFFBQ2QsUUFBUTtBQUFBLFFBQ1IsU0FBUyxVQUFRLEtBQUssUUFBUSxZQUFZLDBCQUEwQjtBQUFBLE1BQ3hFO0FBQUEsTUFDQSxpQkFBaUI7QUFBQSxRQUNiLFFBQVE7QUFBQSxRQUNSLFNBQVMsVUFBUSxLQUFLLFFBQVEsV0FBVyx5QkFBeUI7QUFBQSxNQUN0RTtBQUFBLE1BQ0EsZ0JBQWdCO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixTQUFTLFVBQVEsS0FBSyxRQUFRLFVBQVUsd0JBQXdCO0FBQUEsTUFDcEU7QUFBQSxNQUNBLGFBQWE7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLFNBQVMsVUFBUSxLQUFLLFFBQVEsT0FBTyxxQkFBcUI7QUFBQSxNQUM5RDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDSCxRQUFRLENBQUMsYUFBYSxXQUFXLFlBQVk7QUFBQSxJQUM3QyxhQUFhO0FBQUEsSUFDYixzQkFBc0I7QUFBQSxJQUN0QixXQUFXO0FBQUEsSUFDWCxlQUFlO0FBQUEsTUFDWCxPQUFPO0FBQUEsUUFDSCxPQUFPO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixTQUFTO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixLQUFLO0FBQUEsTUFDVDtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsTUFDcEI7QUFBQSxJQUNKO0FBQUEsRUFDSjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0YsVUFBVTtBQUFBLE1BQ04sVUFBVTtBQUFBLElBQ2Q7QUFBQSxFQUNKO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDRCxxQkFBcUI7QUFBQSxNQUNqQixNQUFNO0FBQUEsUUFDRixLQUFLO0FBQUEsTUFDVDtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFsicmVzb2x2ZSIsICJpc0JldGEiXQp9Cg==
