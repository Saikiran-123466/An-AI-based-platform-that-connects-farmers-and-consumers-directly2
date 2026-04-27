import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import axios from "axios";   // ✅ ADD THIS
axios.defaults.baseURL = "https://agrilink-backend-dhvp.onrender.com";  // ✅ ADD THIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)