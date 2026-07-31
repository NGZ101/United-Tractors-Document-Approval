import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // Tambahkan baris ini

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx'], // Pastikan ini berakhiran .jsx
            refresh: true,
        }),
        react(), // Tambahkan plugin ini di sini
    ],
});
