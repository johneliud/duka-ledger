import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { db } from './db/powersync'
import { AuthProvider } from './lib/AuthProvider'
import { NotificationProvider } from './lib/NotificationProvider'
import { SettingsProvider } from './lib/SettingsContext'

const updateSW = registerSW({
	onNeedRefresh() {
		if (confirm('New version available. Reload to update?')) {
			updateSW(true)
		}
	},
	onOfflineReady() {
	}
})

function Root() {
	useEffect(() => {
		db.init().then(() => {
			if (typeof window !== 'undefined') {
				(window as unknown as { db: typeof db }).db = db
			}
		}).catch((error) => {
			console.error('Failed to initialize database:', error)
		})
	}, [])

	return (
		<NotificationProvider>
			<AuthProvider>
				<SettingsProvider>
					<App />
				</SettingsProvider>
			</AuthProvider>
		</NotificationProvider>
	)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
