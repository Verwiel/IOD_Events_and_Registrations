// Bar display across the top of EventPage and Registration
import { useEvents } from "../../context/EventContext"

export const EventInformationHeader = () => {
    const { selectedEvent } = useEvents()
    const { Delivery_Format__c, Metro_Area__c, State__c, Event_Country__c, Campaign_Class__c, Time_Zone__c } = selectedEvent;
    const timeZoneRegExp = /\(([^)]+)\)/
	const virtualTimeZone = timeZoneRegExp.exec(Time_Zone__c)
    const locationMetro = Delivery_Format__c === 'Virtual' ? `Virtual Classroom ${virtualTimeZone[0]} ` : `${Metro_Area__c}, ${ (!Event_Country__c || Event_Country__c === 'United States') ?  State__c : Event_Country__c }` 
    
    const eventHeader = Campaign_Class__c === 'Breakthroughs' ? 'InsideOut Breakthroughs™' : Campaign_Class__c === 'GROW Coaching Parent' ? 'GROW Coaching Workshop & Facilitator Certification' : 'InsideOut Coaching Workshop & Facilitator Certification'

    return (
        <header>
            <h2>{eventHeader}</h2>
            <p>{locationMetro}</p>
        </header>
    )
}
