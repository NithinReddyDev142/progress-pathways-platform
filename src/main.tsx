
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { config } from './utils/envConfig'

// Log environment on startup in development
if (config.isDevelopment) {
  console.log('Starting application in development mode')
  console.log('API URL:', config.apiUrl)
}

createRoot(document.getElementById("root")!).render(<App />)
