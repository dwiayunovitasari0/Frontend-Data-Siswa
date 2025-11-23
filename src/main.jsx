import { StrictMode } from 'react' //import dari library react
import { createRoot } from 'react-dom/client'
// import './index.css'
import App from './App.jsx' //import komponen utama dari file App.jsx

// Menghubungkan aplikasi React ke DOM di file index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
