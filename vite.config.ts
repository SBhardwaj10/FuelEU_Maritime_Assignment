import { defineConfig } from 'vite'

// Proxy `/api` to the backend running on localhost:4000.
// Change the port below if your backend listens on a different port.
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
