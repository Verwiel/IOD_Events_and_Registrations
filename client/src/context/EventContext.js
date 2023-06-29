import { useState, createContext, useContext } from 'react'
// const eventBaseURL = ''
// const registrationBaseUrl = ''

const EventContext = createContext()
export const useEvents = () => useContext(EventContext)

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState({})
    

    const getEvent = (id) => {
        setSelectedEvent(id)
    }

    return (
        <EventContext.Provider 
            value={{
                events,
                selectedEvent,
                getEvent
            }}>
            { children }
        </EventContext.Provider>
    )
}
