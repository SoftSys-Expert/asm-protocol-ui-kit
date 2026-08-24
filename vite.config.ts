import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'ASMProtocolUIKit',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: [],
      output: {
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    minify: false,
  },
});