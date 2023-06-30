import { Link } from 'react-router-dom'

export const EventTableRegion = ({ regionTitle, regionData }) => {
    return (
        <>
            <strong>{regionTitle}</strong>
            <ul>
                {regionData.map((event) => (
                    <li key={event.Id}>
                        <Link to={`/event/${event.Id}`}>
                            {event.Name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    )
}
