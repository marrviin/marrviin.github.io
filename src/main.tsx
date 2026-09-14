import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { LanguageProvider } from './i18n/language-context'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
