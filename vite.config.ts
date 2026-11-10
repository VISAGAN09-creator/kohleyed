import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  if (env.VITE_FIREBASE_PROJECT_ID !== 'kohleyed-a8060') {
    throw new Error('VITE_FIREBASE_PROJECT_ID must target kohleyed-a8060.');
  }
  if (env.VITE_FIREBASE_AUTH_DOMAIN !== 'kohleyed-a8060.firebaseapp.com' || env.VITE_FIREBASE_STORAGE_BUCKET !== 'kohleyed-a8060.firebasestorage.app') {
    throw new Error('Firebase Auth domain and Storage bucket must belong to Kohleyed.');
  }
  for (const name of ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_MESSAGING_SENDER_ID', 'VITE_FIREBASE_APP_ID']) {
    if (!env[name]) throw new Error(`${name} is required for the Kohleyed frontend.`);
  }
  return {
  plugins: [react()],
  publicDir: false,
  base: '/kohleyed/',
  build: { outDir: 'dist/kohleyed' },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      // The custom-domain mount uses /kohleyed/api, while the local Express
      // server exposes /api. Keep admin and checkout requests working when
      // testing the mounted route locally.
      '/kohleyed/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/kohleyed/, ''),
      },
    },
  },
  };
});
