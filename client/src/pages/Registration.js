import { useEffect } from "react"
import { PageHeader } from "../components/PageHeader"
import { useParams } from "react-router-dom"
import { useEvents } from "../context/EventContext"

export const Registration = () => {
    const { id } = useParams()
    const { getEvent } = useEvents()

    useEffect(() => {
        getEvent(id)
    }, [id])


    return (
        <main>
            <PageHeader title="Event Registration" />
        </main>
    )
}
