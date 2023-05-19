import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styleImport, { VantResolve } from 'vite-plugin-style-import';
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(),
    styleImport({
        resolves: [VantResolve()],
    }),],
    base: './',
    server: {
        host: '0.0.0.0',
        port: 1314
    },
    resolve: {
        // 配置别名
        alias: {
            "@": path.join(__dirname, "./src"),
        },


    },
})
