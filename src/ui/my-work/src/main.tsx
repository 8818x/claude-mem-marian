// Modified by the Marian fork: apply the saved theme before mounting.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyTheme, readTheme } from '../../viewer/themes';
import './index.css'
import App from './App.tsx'

applyTheme(readTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
