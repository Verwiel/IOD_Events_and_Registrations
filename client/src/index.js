import React from 'react'
import ReactDOM from 'react-dom/client'
import './sass/main.scss'
import App from './App'
import { BrowserRouter } from "react-router-dom"
import { EventProvider } from './context/EventProvider'
import { RegistrationProvider } from './context/RegistrationProvider'



const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <EventProvider>
                <RegistrationProvider>
                    <App />
                </RegistrationProvider>
            </EventProvider>
        </BrowserRouter>
    </React.StrictMode>
)
