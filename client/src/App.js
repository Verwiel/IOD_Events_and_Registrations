import { Route, Routes } from "react-router-dom"
import { Events } from './pages/Events'
import { EventPage } from './pages/EventPage'
import { Registration } from './pages/Registration'
import { NotFound } from "./pages/NotFound"

function App() {
    return (
        <Routes>
            <Route path="/" element={<Events />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/register/:id" element={<Registration />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App
