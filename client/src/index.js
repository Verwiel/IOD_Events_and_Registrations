import React from 'react'
import ReactDOM from 'react-dom/client'
import './sass/main.scss'
import App from './App'
import { BrowserRouter } from "react-router-dom"
import { EventProvider } from './context/EventContext'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <EventProvider>
                <App />
            </EventProvider>
        </BrowserRouter>
    </React.StrictMode>
)
