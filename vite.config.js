import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	base: process.env.BASE_PATH || '/',
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()]
});
