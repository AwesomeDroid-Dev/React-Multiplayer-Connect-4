// vite.config.js
import { defineConfig } from 'vite';
import 'dotenv/config'
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 3000,
  },
});
