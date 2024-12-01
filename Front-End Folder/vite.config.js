import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Permite conexiones desde cualquier dirección IP
    port: 5173, // Puerto en el que corre el frontend
    strictPort: true, // Asegura que use ese puerto
    hmr: {
      host: 'ec2-3-227-125-153.compute-1.amazonaws.com', // IP pública de EC2 para HMR
      protocol: 'ws', // Usar WebSocket para HMR
      port: 5173, // El puerto que debe usar para WebSocket
    },
  },
  plugins: [react()],
});
