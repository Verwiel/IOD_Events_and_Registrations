import { useEffect } from 'react'
import { useEvents } from "../context/EventProvider"
import { PageHeader } from "../components/shared/PageHeader"
import { EventTables } from '../components/events/EventTables'

export const Events = () => {
    const { getAllUpcomingEvents, upcomingGrowEvents, upcomingIocEvents, upcomingBtEvents } = useEvents()

    useEffect(() => {
        getAllUpcomingEvents()
    }, [getAllUpcomingEvents])

    const coachingTableHeadings = <tr className='public-events-table-thead'>
        <th>TITLE</th>
        <th>LOCATION</th>
        <th>WORKSHOP</th>
        <th>CERTIFICATION</th>
    </tr>

    const breakthroughsTableHeadings = <tr className='public-events-table-thead'>
        <th>TITLE</th>
        <th>LOCATION</th>
        <th>DATE</th>
    </tr>


    return (
        <main className="public-events">
            <PageHeader title="Events" />

            {upcomingGrowEvents.hasEventsToDisplay && 
                <EventTables 
                    sectionHeader="GROW Coaching™ Workshop & Facilitator Certification" 
                    sectionSubHeader="Experience the world-class coaching workshop." 
                    tableHeadings={coachingTableHeadings}
                    eventsData={upcomingGrowEvents}
                    eventType="GROW"
                />
            }

            {upcomingIocEvents.hasEventsToDisplay && 
                <EventTables 
                    sectionHeader="InsideOut Coaching™ Workshop & Facilitator Certification" 
                    sectionSubHeader="Experience the world-class coaching workshop" 
                    tableHeadings={coachingTableHeadings}
                    eventsData={upcomingIocEvents}
                    eventType="IOC"
                />
            }

            {upcomingBtEvents.hasEventsToDisplay && 
                <EventTables 
                    sectionHeader="Breakthroughs Facilitator Certification" 
                    sectionSubHeader="Get certified to bring coaching and accountability to your frontline" 
                    tableHeadings={breakthroughsTableHeadings}
                    eventsData={upcomingBtEvents}
                    eventType="BT"
                />
            }
        </main>
    )
}
