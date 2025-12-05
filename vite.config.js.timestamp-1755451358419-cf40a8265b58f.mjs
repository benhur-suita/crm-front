// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/DESENVOLVIMENTO/Web/node/crmnode/crm-front/chamados/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/DESENVOLVIMENTO/Web/node/crmnode/crm-front/chamados/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueDevTools from "file:///C:/DESENVOLVIMENTO/Web/node/crmnode/crm-front/chamados/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_import_meta_url = "file:///C:/DESENVOLVIMENTO/Web/node/crmnode/crm-front/chamados/vite.config.js";

var vite_config_default = defineConfig({
    plugins: [
      vue(),
      vueDevTools()
  ],
  resolve: {
      alias: {
          "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      } 
  },
  optimizeDeps: {
      include: ["dayjs"]
  },
  build: {
    sourcemap: true // ✅ Adiciona suporte a sourcemaps
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxERVNFTlZPTFZJTUVOVE9cXFxcV2ViXFxcXG5vZGVcXFxcY3Jtbm9kZVxcXFxjcm0tZnJvbnRcXFxcY2hhbWFkb3NcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXERFU0VOVk9MVklNRU5UT1xcXFxXZWJcXFxcbm9kZVxcXFxjcm1ub2RlXFxcXGNybS1mcm9udFxcXFxjaGFtYWRvc1xcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovREVTRU5WT0xWSU1FTlRPL1dlYi9ub2RlL2NybW5vZGUvY3JtLWZyb250L2NoYW1hZG9zL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVEZXZUb29scyBmcm9tICd2aXRlLXBsdWdpbi12dWUtZGV2dG9vbHMnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICB2dWVEZXZUb29scygpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogWydkYXlqcyddXG4gIH1cbn0pIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrVyxTQUFTLGVBQWUsV0FBVztBQUVyWSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxpQkFBaUI7QUFKeU0sSUFBTSwyQ0FBMkM7QUFNbFIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsT0FBTztBQUFBLEVBQ25CO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
