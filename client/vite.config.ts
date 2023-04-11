import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@three": path.resolve(__dirname, "src/three"),
      "@data": path.resolve(__dirname, "src/three/data"),
      "@component": path.resolve(__dirname, "src/three/component"),
      "@quark": path.resolve(__dirname, "src/three/component/quark"),
      "@atom": path.resolve(__dirname, "src/three/component/atom"),
      "@molecule": path.resolve(__dirname, "src/three/component/molecule"),
      "@template": path.resolve(__dirname, "src/three/component/template"),
    },
  },
});
