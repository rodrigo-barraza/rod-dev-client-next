import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { transformWithEsbuild } from 'vite';

const forceJsx = {
  name: 'force-jsx',
  enforce: 'pre',
  async transform(code, id) {
    if (id.endsWith('.js') && !id.includes('node_modules')) {
      return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
    }
  },
};

export default defineConfig({
  plugins: [forceJsx, react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
