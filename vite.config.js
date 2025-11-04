import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node18',
    outDir: 'dist',
    lib: {
      entry: 'src/server.js',
      formats: ['es']
    },
    rollupOptions: {
      external: ['express', 'pdf-to-img', 'cors']
    }
  }
});
