import { useState, createContext, useContext } from 'react'
import axios from 'axios'

const EventContext = createContext()
export const useEvents = () => useContext(EventContext)

export const EventProvider = ({ children }) => {
    const workshopPrice = 399
    const certPrice = 3500
    const fullEventPrice = 3999
    const breakthroughsPrice = 899
    const [upcomingGrowEvents, setUpcomingGrowEvents] = useState([])
    const [upcomingIocEvents, setUpcomingIocEvents] = useState([])
    const [upcomingBtEvents, setUpcomingBtEvents] = useState([])

    const [selectedEvent, setSelectedEvent] = useState({})
    const [selectedEventType, setSelectedEventType] = useState({})
    const [eventLoading, setEventLoading] = useState(true)
    

    const getEvent = async (id) => {
        try {
            let { data } = await axios.get(`/events/with-children/${id}`)
            if(data.Campaign_Class__c.includes('GROW')){
                setSelectedEventType('GROW Coaching')
            }
            if(data.Campaign_Class__c.includes('InsideOut Coaching')){
                setSelectedEventType('IOC')
            }
            if(data.Campaign_Class__c.includes('Breakthroughs')){
                setSelectedEventType('Breakthroughs')
            }
            setSelectedEvent(data)
            setEventLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const getAllUpcomingEvents = async () => {
        try {
            let { data } = await axios.get('/events/upcoming')
            let parentsOnly = data.filter(event => event.Campaign_Class__c.includes('Parent'))
            let allGrowEvents = parentsOnly.filter(event => event.Campaign_Class__c.includes('GROW'))
            let allIocEvents = parentsOnly.filter(event => event.Campaign_Class__c.includes('IOC'))
            // Breakthroughs dosent have children events so it dosent have Parent in the campaign class.
            let allBtEvents = data.filter(event => event.Campaign_Class__c.includes('Breakthroughs'))

            let growEvents = {
                "hasEventsToDisplay": allGrowEvents.length > 0,
                "Americas": allGrowEvents.filter(event => event.Region__c === 'Americas'),
                "APAC": allGrowEvents.filter(event => event.Region__c === 'APAC'),
                "EMEA": allGrowEvents.filter(event => event.Region__c === 'EMEA')
            }

            let iocEvents = {
                "hasEventsToDisplay": allIocEvents.length > 0,
                "Americas": allIocEvents.filter(event => event.Region__c === 'Americas'),
                "APAC": allIocEvents.filter(event => event.Region__c === 'APAC'),
                "EMEA": allIocEvents.filter(event => event.Region__c === 'EMEA')
            }

            let btEvents = {
                "hasEventsToDisplay": allBtEvents.length > 0,
                "Americas": allBtEvents.filter(event => event.Region__c === 'Americas'),
                "APAC": allBtEvents.filter(event => event.Region__c === 'APAC'),
                "EMEA": allBtEvents.filter(event => event.Region__c === 'EMEA')
            }

            setUpcomingGrowEvents(growEvents)
            setUpcomingIocEvents(iocEvents)
            setUpcomingBtEvents(btEvents)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <EventContext.Provider 
            value={{
                selectedEvent,
                selectedEventType,
                upcomingGrowEvents,
                upcomingIocEvents,
                upcomingBtEvents,
                eventLoading,
                workshopPrice,
                certPrice,
                fullEventPrice,
                breakthroughsPrice,
                getEvent,
                getAllUpcomingEvents
            }}>
            { children }
        </EventContext.Provider>
    )
}
