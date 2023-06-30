import React from 'react'
import { EventTableRegion } from './EventTableRegion'

export const EventTables = ({ sectionHeader, sectionSubHeader, tableHeadings, eventsData, eventType }) => {
    return (
        <section>
            <header>
                <h2>{sectionHeader}</h2>
                <p>{sectionSubHeader}</p>
            </header>
            <table className='table-font public-events-coaching-table public-events-table'>
                <thead>{tableHeadings}</thead>

                <tbody className='public-events-table-tbody'>
                    {eventsData.Americas.length > 0 && 
                        <EventTableRegion eventData={eventsData.Americas} eventType={eventType} region="North America" />
                    }

                    {eventsData.APAC.length > 0 &&
                        <EventTableRegion eventData={eventsData.APAC} eventType={eventType} region="APAC" />
                    }

                    {eventsData.EMEA.length > 0 &&
                        <EventTableRegion eventData={eventsData.EMEA} eventType={eventType} region="EMEA" />
                    }
                </tbody>
            </table>
        </section>
    )
}
