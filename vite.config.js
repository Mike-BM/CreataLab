import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  logLevel: 'info',
  base: '/', // Base public path when served in production
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components/ui': path.resolve(__dirname, './src/UI'),
      '@/UI': path.resolve(__dirname, './src/UI'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  plugins: [
    react(),
  ]
});