import { useEffect } from 'react'
import { PageHeader } from "../components/PageHeader"
import { useEvents } from "../context/EventContext"

export const EventsList = () => {
    const { getAllUpcomingEvents, upcomingGrowEvents, upcomingIocEvents, upcomingBtEvents } = useEvents()

    useEffect(() => {
        getAllUpcomingEvents()
    }, [])

    return (
        <main>
            <PageHeader title="Events" />

            {upcomingGrowEvents.hasEventsToDisplay && 
                <section>
                    <header>GROW Events</header>
                    {upcomingGrowEvents.Americas.length > 0 &&
                    <>
                        <strong>Americas</strong>
                        <ul>
                            {upcomingGrowEvents.Americas.map((event) => (
                                <li key={event.Id}>{event.Name}</li>
                            ))}
                        </ul>
                    </>
                    }
                    {upcomingGrowEvents.APAC.length > 0 &&
                    <>
                        <strong>APAC</strong>
                        <ul>
                            {upcomingGrowEvents.APAC.map((event) => (
                                <li key={event.Id}>{event.Name}</li>
                            ))}
                        </ul>
                    </>
                    }
                    {upcomingGrowEvents.EMEA.length > 0 &&
                    <>
                        <strong>EMEA</strong>
                        <ul>
                            {upcomingGrowEvents.EMEA.map((event) => (
                                <li key={event.Id}>{event.Name}</li>
                            ))}
                        </ul>
                    </>
                    }
                </section>
            }

            {upcomingIocEvents.hasEventsToDisplay && 
                <section>
                    <header>InsideOut Coaching Events</header>
                    {upcomingIocEvents.Americas.length > 0 &&
                    <>
                        <strong>Americas</strong>
                        <ul>
                            {upcomingIocEvents.Americas.map((event) => (
                                <li key={event.Id}>{event.Name}</li>
                            ))}
                        </ul>
                    </>
                    }
                    {upcomingIocEvents.APAC.length > 0 &&
                    <>
                        <strong>APAC</strong>
                        <ul>
                            {upcomingIocEvents.APAC.map((event) => (
                                <li key={event.Id}>{event.Name}</li>
                            ))}
                        </ul>
                    </>
                    }
                    {upcomingIocEvents.EMEA.length > 0 &&
                    <>
                        <strong>EMEA</strong>
                        <ul>
                            {upcomingIocEvents.EMEA.map((event) => (
                                <li key={event.Id}>{event.Name}</li>
                            ))}
                        </ul>
                    </>
                    }
                </section>
            }

            {upcomingBtEvents.hasEventsToDisplay && 
                <section>
                    <header>Breakthroughs</header>
                    {upcomingBtEvents.Americas.length > 0 &&
                    <>
                        <strong>Americas</strong>
                        <ul>
                            {upcomingBtEvents.Americas.map((event) => (
                                <li key={event.Id}>{event.Name}</li>
                            ))}
                        </ul>
                    </>
                    }
                    {upcomingBtEvents.APAC.length > 0 &&
                    <>
                        <strong>APAC</strong>
                        <ul>
                            {upcomingBtEvents.APAC.map((event) => (
                                <li key={event.Id}>{event.Name}</li>
                            ))}
                        </ul>
                    </>
                    }
                    {upcomingBtEvents.EMEA.length > 0 &&
                    <>
                        <strong>EMEA</strong>
                        <ul>
                            {upcomingBtEvents.EMEA.map((event) => (
                                <li key={event.Id}>{event.Name}</li>
                            ))}
                        </ul>
                    </>
                    }
                </section>
            }
        </main>
    )
}
