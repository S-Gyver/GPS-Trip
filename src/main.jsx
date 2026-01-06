// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './styles/tokens.css'
import './styles/global.css'

import App from './App.jsx'
import { SessionProvider } from './hooks/useSession.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👈 2. ลบ basename="/GPS-Trip/" ทิ้งไปเลย หรือแก้เป็น "/" */}
    <BrowserRouter> 
      <SessionProvider>
        <App />
      </SessionProvider>
    </BrowserRouter>
  </React.StrictMode>
)