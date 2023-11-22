import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
console.log(resolve(__dirname, 'src/index.ts'))
export default defineConfig({
	plugins: [vue()],

	resolve: {
		alias: {
			'@': resolve(__dirname, 'src'),
		},
	},

	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'plat-rs-sdk',
			// the proper extensions will be added
			fileName: 'plat-rs-sdk',
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ['vue'],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					vue: 'Vue',
				},
			},
		},
		tsconfig: 'tsconfig.json',
	},
})
