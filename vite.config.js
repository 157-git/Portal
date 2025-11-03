import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 👇 Add this part
  define: {
    global: 'window', // Fixes "global is not defined"
  },

  optimizeDeps: {
    include: ['@stomp/stompjs', 'sockjs-client'], // Ensures Vite bundles these correctly
  },
})

