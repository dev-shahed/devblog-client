import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true, //With globals: true, there is no need to import keywords such as describe, test and expect into the tests.
    setupFiles: './testSetup.js',
    // Specify where the tests are located
    include: ['tests/**/*.test.{js,ts,jsx,tsx}'],
    // Exclude the default node_modules
    exclude: [...configDefaults.exclude, 'node_modules'],
  },
});
