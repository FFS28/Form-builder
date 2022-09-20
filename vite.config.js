import { sveltekit } from '@sveltejs/kit/vite';
import 'dotenv/config';

const apiRoot = process.env.PUBLIC_API_ROOT;

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	server: {
		proxy: {
			'/api': apiRoot,
			'/data': apiRoot,
			'/count': apiRoot,
			'/upload': apiRoot,
			'/download': apiRoot
		}
	}
};

export default config;
