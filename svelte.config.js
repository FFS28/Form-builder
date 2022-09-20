import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$structures: 'src/structures',
			$repositories: 'src/repositories',
			$services: 'src/services',
		}
	},
	preprocess: preprocess({
		postcss: true
	})
};

export default config;
