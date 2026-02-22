import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'prompt',
			strategies: 'generateSW',
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365
							}
						}
					},
					{
						urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'api-cache',
							networkTimeoutSeconds: 10,
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 5
							}
						}
					}
				],
				navigateFallback: '/index.html',
				navigateFallbackDenylist: [/^\/api/]
			},
			manifest: {
				name: 'Duka Ledger',
				short_name: 'Duka',
				description: 'Offline-first shop bookkeeper for market vendors',
				theme_color: '#c4622d',
				background_color: '#fef7ee',
				display: 'standalone',
				orientation: 'portrait',
				start_url: '/',
				icons: [
					{
						src: '/icon-192.svg',
						sizes: '192x192',
						type: 'image/svg+xml'
					},
					{
						src: '/icon-512.svg',
						sizes: '512x512',
						type: 'image/svg+xml'
					},
					{
						src: '/icon-512.svg',
						sizes: '512x512',
						type: 'image/svg+xml',
						purpose: 'maskable'
					}
				]
			}
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	worker: {
		format: 'es'
	},
	optimizeDeps: {
		exclude: ['@powersync/web']
	},
	server: {
		allowedHosts: [
			'bentlee-flawed-sunshine.ngrok-free.dev'
		]
	}
})
