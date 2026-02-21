import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import{Provider} from "react-redux"
import { store } from './pages/redux/Store.js'
import "./i18n";
import Footer from './pages/UsersComponents/Footer.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
   <Provider store={store}>
  <App />
  
  </Provider>
  </BrowserRouter>
  
)
