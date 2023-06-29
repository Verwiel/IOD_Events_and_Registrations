import { Route, Routes } from "react-router-dom"
import { EventsList } from './pages/EventsList'
import { EventPage } from './pages/EventPage'
import { Registration } from './pages/Registration'
import { NotFound } from "./pages/NotFound"

function App() {
    return (
        <Routes>
            <Route path="/" element={<EventsList />} />
            <Route path="/event/:id" element={<EventPage />} />
            <Route path="/register/:id" element={<Registration />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App
