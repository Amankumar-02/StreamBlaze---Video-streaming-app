import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api': 'https://youtube-clone-backend.cyclic.app/api/v1'
      // '/api': 'https://streamblaze-backend-server.vercel.app/api/v1'
      '/api': 'https://streamify-backend-server.onrender.com/api/v1'
    }
  }
  // server: {
  //   proxy: {
  //     '/api': 'https://nervous-newt-purse.cyclic.app/api/v1'
  //   }
  // }
})
