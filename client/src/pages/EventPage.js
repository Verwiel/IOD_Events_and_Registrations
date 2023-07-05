import { useEvents } from "../context/EventProvider"
import { EventAndRegistrationLayout } from "../components/shared/EventAndRegistrationLayout"
import { GrowCoachingSummary, InsideOutCoachingSummary, BreakthroughSummary } from '../components/events/EventTypeSummaries'

export const EventPage = () => {
    const { selectedEventType } = useEvents()

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
        <EventAndRegistrationLayout isRegistration={false}>
            {summaryPage}
        </EventAndRegistrationLayout>
    )
}
