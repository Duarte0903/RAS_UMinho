import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces
    port: 5005,      // Use port 5005 for the dev server
    hmr: {
      host: 'p.primecog.com', // Public hostname for WebSocket HMR
      protocol: 'wss',        // Use secure WebSocket protocol
    },
  },
});
