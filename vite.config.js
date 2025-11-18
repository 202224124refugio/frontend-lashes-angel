import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],

    server: {
        proxy: {
            // Cualquier solicitud que comience con '/api'
            '/api': {
                // Será redirigida a tu backend
                target: 'http://localhost:3000', // <-- CAMBIA ESTE PUERTO si tu backend corre en otro
                changeOrigin: true, // Necesario para que el backend acepte la solicitud
            }
        }
    }

})