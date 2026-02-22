import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { db } from './db/powersync'

const updateSW = registerSW({
	onNeedRefresh() {
		if (confirm('New version available. Reload to update?')) {
			updateSW(true)
		}
	},
	onOfflineReady() {
		console.log('App ready to work offline')
	}
})

function Root() {
	useEffect(() => {
		db.init().then(() => {
			console.log('PowerSync database initialized')
			// Expose db to window for console testing
			if (typeof window !== 'undefined') {
				(window as unknown as { db: typeof db }).db = db
			}
		}).catch((error) => {
			console.error('Failed to initialize database:', error)
		})
	}, [])

	return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
