import { useState } from 'react'
import { EventTableItem } from './EventTableItem'

export const EventTableRegion = ({ eventData, eventType, region }) => {
    const quantityToDisplay = 6
    const [displayAllEvents, setDisplayAllEvents] = useState(false)
	let displayedEvents = []

	!displayAllEvents ? 
        displayedEvents = eventData.slice(0, quantityToDisplay) 
        : 
        displayedEvents = eventData

    const displayEventsMap = displayedEvents.map(event => (
        <EventTableItem
            key={`EventIndex-${event.Id}`} 
            Id={event.Id}
            event={event}
        />
    ))
    
    return (
        <>
            <tr className='public-events-table-tbody-event'>
                <th 
                    className='public-events-table-tbody-event-th' 
                    colSpan={eventType !== "BT" ? "4" : "3"}>
                        {region}
                </th>
            </tr>

            {displayEventsMap}
            
            {eventData.length > quantityToDisplay ?
                <tr>
                    <td 
                        colSpan={eventType !== "BT" ? "4" : "3"} className='table-see-more'>
                        <label> 
                            { !displayAllEvents ? 'Show All' : 'Show Less' }
                            <button  style={{marginTop: '10px'}}
                                onClick={() => setDisplayAllEvents(!displayAllEvents)}
                            >
                                {!displayAllEvents ? '+' : '-'}
                            </button> 
                        </label> 
                    </td>
                </tr>
                // must be null for table
                : null
            }
        </>
    )
}
