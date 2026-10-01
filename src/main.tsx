import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/playfair-display'
import '@fontsource-variable/playfair-display/wght-italic.css'
import '@fontsource/archivo-black'
import './index.css'
import App from './App'
import { BusinessProvider } from './context/BusinessContext'
import { CustomerProvider } from './context/CustomerContext'
import { ToastProvider } from './context/ToastContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CustomerProvider>
          <BusinessProvider>
            <App />
          </BusinessProvider>
        </CustomerProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
