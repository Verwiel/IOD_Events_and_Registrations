import { useEffect } from "react"
import { PageHeader } from "../components/PageHeader"
import { useParams } from "react-router-dom"
import { useEvents } from "../context/EventContext"

export const EventPage = () => {
    const { id } = useParams()
    const { getEvent } = useEvents()

    useEffect(() => {
        getEvent(id)
    }, [id])

    // if(Campaign_Class__c.includes('GROW'))
    // if(Campaign_Class__c.includes('IOC'))
    // if(Campaign_Class__c.includes('Breakthrough'))

    return (
        <main>
            <PageHeader title="Event" />
        </main>
    )
}
