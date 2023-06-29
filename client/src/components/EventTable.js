import { EventTableRegion } from './EventTableRegion'

export const EventTable = ({ eventData, tableHeader }) => {
    return (
        <section>
            <header>{tableHeader}</header>
            {eventData.Americas.length > 0 &&
                <EventTableRegion regionTitle="Americas" regionData={eventData.Americas} />
            }
            {eventData.APAC.length > 0 &&
                <EventTableRegion regionTitle="APAC" regionData={eventData.APAC} />
            }
            {eventData.EMEA.length > 0 &&
                <EventTableRegion regionTitle="EMEA" regionData={eventData.EMEA} />
            }
        </section>
    )
}
