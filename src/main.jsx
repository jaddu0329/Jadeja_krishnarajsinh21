// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import ReactPage from './pages/ReactPage.jsx'
import HtmlPage from './pages/HtmlPage.jsx'
import LocalPhotosPage from './pages/LocalPhotosPage.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/react" element={<ReactPage />} />
        <Route path="/html" element={<HtmlPage />} />
        <Route path="/local-photos" element={<LocalPhotosPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)