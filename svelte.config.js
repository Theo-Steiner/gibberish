import adapterBrowserExtension from 'sveltekit-adapter-browser-extension';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		prerender: {
			default: true
		},
		adapter: adapterBrowserExtension(),
		appDir: 'ext'
	}
};

export default config;
