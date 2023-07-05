import Moment from "react-moment"
import { Link } from 'react-router-dom'
import { RegexTimeZone } from "../../util/RegexTimeZone"

export const EventTableItem = ({ event }) => {
    const { Id, Is_Workshop_Full__c, Is_T3_Full__c, Campaign_Class__c, Time_Zone__c, Delivery_Format__c, Metro_Area__c, State__c, Event_Country__c, X1_Day_Start_DateTime__c, X2_Day_Start_date_time__c, X3_Day_Start_date_time__c, workshop, certification, fullEvent } = event

    const locationMetro = Delivery_Format__c === 'Virtual' ? `Virtual Classroom - ${RegexTimeZone(Time_Zone__c)} ` : `${Metro_Area__c}, ${ (!Event_Country__c || Event_Country__c === 'United States') ?  State__c : Event_Country__c }` 
    
    let eventTypeDisplay = ""
    if(Campaign_Class__c.includes('GROW')){
        eventTypeDisplay = "GROW Coaching"
    }
    if(Campaign_Class__c.includes('IOC')){
        eventTypeDisplay = "InsideOut Coaching"
    }
    if(Campaign_Class__c.includes('Breakthroughs')){
        eventTypeDisplay = "Breakthroughs Facilitator Certification"
    }

    let cantClickLink = Is_Workshop_Full__c && Is_T3_Full__c
    let titleLink = <Link to={`/event/${Id}`}>{eventTypeDisplay}</Link>
    let titleDisplay = cantClickLink ? eventTypeDisplay : titleLink

    let workshopDisplay;
    if(workshop.IsActive || fullEvent.IsActive){
        if(Is_Workshop_Full__c){
            workshopDisplay = "Sold Out"
        }else{
            workshopDisplay = <Moment format="MMM D, YYYY">{X1_Day_Start_DateTime__c}</Moment>
        }
    } 

    let certificationDisplay;

    if(certification.IsActive || fullEvent.IsActive){
        if(Is_T3_Full__c){
            certificationDisplay = "Sold Out"
        } else if(Campaign_Class__c === "Breakthroughs"){
            certificationDisplay = <Moment format="MMM D, YYYY">{X2_Day_Start_date_time__c}</Moment>
            
        } else {
            certificationDisplay = (
                <>
                    <Moment format="MMM D, YYYY">{X2_Day_Start_date_time__c}</Moment>
                        {' '} to {' '}
                    <Moment format="MMM D, YYYY">{X3_Day_Start_date_time__c}</Moment>
                </> 
            )
        }
    } 

    return (
        <tr className='public-events-table-tbody-event'>
            <td>{titleDisplay}</td>
            <td>{locationMetro}</td>
            <td>{workshopDisplay}</td>
            <td>{certificationDisplay}</td>
        </tr>
    )
}
