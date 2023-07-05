import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useEvents } from "../../context/EventProvider"
import { PageHeader } from "./PageHeader"
import { EventInfoPanel } from "./EventInfoPanel"
import { EventInformationHeader } from "./EventInformationHeader"

export const EventAndRegistrationLayout = ({ children, isRegistration }) => {
    const { id } = useParams()
    const { getEvent, selectedEventType, eventLoading } = useEvents()

    useEffect(() => {
        getEvent(id)
    }, [id])

    return (
        <main className="page-layout">
            <PageHeader title={`${selectedEventType} Event ${isRegistration ? "Registration" : ""}`} />

            {eventLoading ?
                <h1>Loading...</h1>
                :
                <section>
                    <EventInformationHeader />

                    <div>
                        {children}
                        <EventInfoPanel registrationDetails={isRegistration} />            
                    </div>
                </section>
            }
        </main>
    );
};
