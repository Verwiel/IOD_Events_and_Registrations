import { useEffect } from "react"
import { PageHeader } from "../components/shared/PageHeader"
import { useParams } from "react-router-dom"
import { useEvents } from "../context/EventContext"
import { EventInfoPanel } from "../components/shared/EventInfoPanel"
import { EventInformationHeader } from "../components/shared/EventInformationHeader"
import { GrowCoachingSummary, InsideOutCoachingSummary, BreakthroughSummary } from '../components/events/EventTypeSummaries'

export const EventPage = () => {
    const { id } = useParams()
    const { getEvent, selectedEventType, eventLoading } = useEvents()

    useEffect(() => {
        getEvent(id)
    }, [id])

    let summaryPage;
    switch(selectedEventType){
        case "GROW Coaching":
            summaryPage = <GrowCoachingSummary />
            break;
        case "InsideOut Coaching":
            summaryPage = <InsideOutCoachingSummary />
            break;
        case "Breakthroughs":
            summaryPage = <BreakthroughSummary />
            break;
        default:
            break;
    }

    return (
        <main>
            {eventLoading ?
            <h1>Loading...</h1>
            :
            <>
            <PageHeader title={`${selectedEventType} Event`} />
            <section>
                <EventInformationHeader />

                <div>
                    {summaryPage}
                    <EventInfoPanel registrationDetails={false} />            
                </div>
            </section>
            </>
            }
        </main>
    )
}
