// .storybook/vite-storybook.config.ts
import react from "file:///C:/Users/somgu/OneDrive/Desktop/UT-Registration-Plus/node_modules/.pnpm/@vitejs+plugin-react-swc@3.6.0_vite@5.1.2/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { resolve } from "path";
import UnoCSS from "file:///C:/Users/somgu/OneDrive/Desktop/UT-Registration-Plus/node_modules/.pnpm/unocss@0.58.5_postcss@8.4.35_vite@5.1.2/node_modules/unocss/dist/vite.mjs";
import Icons from "file:///C:/Users/somgu/OneDrive/Desktop/UT-Registration-Plus/node_modules/.pnpm/unplugin-icons@0.18.5_@svgr+core@8.1.0/node_modules/unplugin-icons/dist/vite.js";
import { defineConfig } from "file:///C:/Users/somgu/OneDrive/Desktop/UT-Registration-Plus/node_modules/.pnpm/vite@5.1.2_@types+node@20.11.17_sass@1.70.0/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "C:\\Users\\somgu\\OneDrive\\Desktop\\UT-Registration-Plus\\.storybook";
var root = resolve(__vite_injected_original_dirname, "../src");
var pagesDir = resolve(root, "pages");
var assetsDir = resolve(root, "assets");
var publicDir = resolve(__vite_injected_original_dirname, "../public");
console.log(root);
var vite_storybook_config_default = defineConfig({
  plugins: [react(), UnoCSS(), Icons({ compiler: "jsx", jsx: "react" })],
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
  }
});
export {
  vite_storybook_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnN0b3J5Ym9vay92aXRlLXN0b3J5Ym9vay5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxzb21ndVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFVULVJlZ2lzdHJhdGlvbi1QbHVzXFxcXC5zdG9yeWJvb2tcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHNvbWd1XFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcVVQtUmVnaXN0cmF0aW9uLVBsdXNcXFxcLnN0b3J5Ym9va1xcXFx2aXRlLXN0b3J5Ym9vay5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3NvbWd1L09uZURyaXZlL0Rlc2t0b3AvVVQtUmVnaXN0cmF0aW9uLVBsdXMvLnN0b3J5Ym9vay92aXRlLXN0b3J5Ym9vay5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJztcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcbmltcG9ydCBVbm9DU1MgZnJvbSAndW5vY3NzL3ZpdGUnO1xuaW1wb3J0IEljb25zIGZyb20gJ3VucGx1Z2luLWljb25zL3ZpdGUnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5cbmNvbnN0IHJvb3QgPSByZXNvbHZlKF9fZGlybmFtZSwgJy4uL3NyYycpO1xuY29uc3QgcGFnZXNEaXIgPSByZXNvbHZlKHJvb3QsICdwYWdlcycpO1xuY29uc3QgYXNzZXRzRGlyID0gcmVzb2x2ZShyb290LCAnYXNzZXRzJyk7XG5jb25zdCBwdWJsaWNEaXIgPSByZXNvbHZlKF9fZGlybmFtZSwgJy4uL3B1YmxpYycpO1xuXG5jb25zb2xlLmxvZyhyb290KTtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gICAgcGx1Z2luczogW3JlYWN0KCksIFVub0NTUygpLCBJY29ucyh7IGNvbXBpbGVyOiAnanN4JywganN4OiAncmVhY3QnIH0pXSxcbiAgICByZXNvbHZlOiB7XG4gICAgICAgIGFsaWFzOiB7XG4gICAgICAgICAgICBzcmM6IHJvb3QsXG4gICAgICAgICAgICAnQGFzc2V0cyc6IGFzc2V0c0RpcixcbiAgICAgICAgICAgICdAcGFnZXMnOiBwYWdlc0RpcixcbiAgICAgICAgICAgICdAcHVibGljJzogcHVibGljRGlyLFxuICAgICAgICAgICAgJ0BzaGFyZWQnOiByZXNvbHZlKHJvb3QsICdzaGFyZWQnKSxcbiAgICAgICAgICAgICdAYmFja2dyb3VuZCc6IHJlc29sdmUocGFnZXNEaXIsICdiYWNrZ3JvdW5kJyksXG4gICAgICAgICAgICAnQHZpZXdzJzogcmVzb2x2ZShyb290LCAndmlld3MnKSxcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlaLE9BQU8sV0FBVztBQUNuYSxTQUFTLGVBQWU7QUFDeEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUo3QixJQUFNLG1DQUFtQztBQU16QyxJQUFNLE9BQU8sUUFBUSxrQ0FBVyxRQUFRO0FBQ3hDLElBQU0sV0FBVyxRQUFRLE1BQU0sT0FBTztBQUN0QyxJQUFNLFlBQVksUUFBUSxNQUFNLFFBQVE7QUFDeEMsSUFBTSxZQUFZLFFBQVEsa0NBQVcsV0FBVztBQUVoRCxRQUFRLElBQUksSUFBSTtBQUdoQixJQUFPLGdDQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTLENBQUMsTUFBTSxHQUFHLE9BQU8sR0FBRyxNQUFNLEVBQUUsVUFBVSxPQUFPLEtBQUssUUFBUSxDQUFDLENBQUM7QUFBQSxFQUNyRSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxLQUFLO0FBQUEsTUFDTCxXQUFXO0FBQUEsTUFDWCxVQUFVO0FBQUEsTUFDVixXQUFXO0FBQUEsTUFDWCxXQUFXLFFBQVEsTUFBTSxRQUFRO0FBQUEsTUFDakMsZUFBZSxRQUFRLFVBQVUsWUFBWTtBQUFBLE1BQzdDLFVBQVUsUUFBUSxNQUFNLE9BQU87QUFBQSxJQUNuQztBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
