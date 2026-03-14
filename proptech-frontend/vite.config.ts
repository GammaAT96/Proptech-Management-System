import { defineConfig } from 'vite';
import path from 'path';

// Minimal Vite config for React + TS using the @ alias.
// We skip @vitejs/plugin-react to avoid version/peer-dependency issues.

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});


