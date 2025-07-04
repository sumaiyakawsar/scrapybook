import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ScrapbookProvider } from "./contexts/ScrapbookContext";
import { ThemeProvider } from "./contexts/ThemeContext"; // optional

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ScrapbookProvider>
        <App />
      </ScrapbookProvider>
    </ThemeProvider>
  </StrictMode>,
)
