import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register'
import { AuthProvider } from './lib/AuthProvider'
import { NotificationProvider } from './lib/NotificationProvider'
import { SettingsProvider } from './lib/SettingsProvider'
import { Root } from './lib/Root'

const updateSW = registerSW({
	onNeedRefresh() {
		if (confirm('New version available. Reload to update?')) {
			updateSW(true)
		}
	},
	onOfflineReady() {
	}
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root>
      <NotificationProvider>
        <AuthProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </AuthProvider>
      </NotificationProvider>
    </Root>
  </StrictMode>,
)
