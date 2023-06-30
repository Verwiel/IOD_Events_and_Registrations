import { useEffect } from 'react'
import { useEvents } from "../context/EventContext"
import { PageHeader } from "../components/shared/PageHeader"
import { EventTable } from '../components/events/EventTable'

export const EventsList = () => {
    const { getAllUpcomingEvents, upcomingGrowEvents, upcomingIocEvents, upcomingBtEvents } = useEvents()

    useEffect(() => {
        getAllUpcomingEvents()
    }, [])

    return (
        <main>
            <PageHeader title="Events" />

            {upcomingGrowEvents.hasEventsToDisplay && 
                <EventTable eventData={upcomingGrowEvents} tableHeader="GROW Events" />
            }

            {upcomingIocEvents.hasEventsToDisplay && 
                <EventTable eventData={upcomingIocEvents} tableHeader="InsideOut Coaching Events" />
            }

            {upcomingBtEvents.hasEventsToDisplay && 
                <EventTable eventData={upcomingBtEvents} tableHeader="Breakthroughs" />
            }
        </main>
    )
}
