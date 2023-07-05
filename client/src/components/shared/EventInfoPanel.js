// Side panel that shows the event & regisration details. 
// Used on EventPage and Registration
import Moment from "react-moment"
import { useEvents } from "../../context/EventProvider"
import { EventInfoPanelDetails } from "../events/EventInfoPanelDetails"
import { EventInfoPanelRegistration } from "../registrations/EventInfoPanelRegistration"
import { RegexTimeZone } from "../../util/RegexTimeZone"

export const EventInfoPanel = ({ registrationDetails }) => {
    const { selectedEvent } = useEvents()
    const {
		City__c,
		State__c,
		Event_Country__c,
		Venue__c,
		Street_Address__c,
		Zip_Code__c,
		Is_Workshop_Full__c,
		Is_T3_Full__c,
		Id,
        Campaign_Class__c,
        Delivery_Format__c,
		Time_Zone__c,
        X1_Day_Start_DateTime__c,
        X1_Day_End_Date_Time__c,
        X2_Day_Start_date_time__c,
        X2_Day_End_date_time__c,
        workshop,
        certification,
        fullEvent
	} = selectedEvent;

    const reviewLocation = Delivery_Format__c === 'Virtual' ? 'Virtual Classroom' : 'Venue TBD'

    return (
        <aside className='registrations-and-event-details-panel'>
            <div className='text-body'>
                <header>
                    <h3 className='registrations-headers'>EVENT DETAILS</h3>
                </header>
                <section>
                    <h4>WHEN</h4>
                    {Campaign_Class__c !== 'Breakthroughs' &&
                        <>
                            {(workshop.IsActive || fullEvent.IsActive) &&
                                <ul>
                                    <li><strong>Workshop</strong></li>
                                    <li><Moment format="dddd, ll">{X1_Day_Start_DateTime__c}</Moment></li>
                                    <li><Moment format="LT">{X1_Day_Start_DateTime__c}</Moment> - <Moment format="LT">{X1_Day_End_Date_Time__c}</Moment> {RegexTimeZone(Time_Zone__c)}</li>
                                    {Is_Workshop_Full__c && <span className="event-sold-out">Sold Out</span>}
                                </ul>
                            }
                        </>
                    }

                    {(certification.IsActive || fullEvent.IsActive || Campaign_Class__c === 'Breakthroughs') &&
                        <ul>
                            <li><strong>Certification</strong></li>
                            <li>
                                <Moment format="ddd, ll">{X2_Day_Start_date_time__c}</Moment>
                                {Campaign_Class__c !== 'Breakthroughs' &&
                                <>
                                {" "}- <Moment format="ddd, ll">{X2_Day_End_date_time__c}</Moment>
                                </>
                                } 
                            </li>
                            <li><Moment format="LT">{X2_Day_Start_date_time__c}</Moment> - <Moment format="LT">{X2_Day_End_date_time__c}</Moment> {RegexTimeZone(Time_Zone__c)}</li>
                            {Is_T3_Full__c && <span className="event-sold-out">Sold Out</span>}
                        </ul>
                    }
                </section>
                <section>
                    <h4>WHERE</h4>
                    {Venue__c === null && Campaign_Class__c !== 'Breakthroughs' ? 
                        <ul>
                            <li>{reviewLocation}</li>
                        </ul>
                        : Campaign_Class__c === 'Breakthroughs' ?
                        <ul>
                            <li>{City__c}</li>
                        </ul>
                        :
                        <ul>
                            <li>{Venue__c}</li>
                            <li>{Street_Address__c}</li>
                            <li>{City__c}, { (!Event_Country__c || Event_Country__c === 'United States') ?  State__c : Event_Country__c } {Zip_Code__c}</li>
                        </ul>
                    }
                </section>

                {!registrationDetails &&
                    <EventInfoPanelDetails Id={Id} Campaign_Class__c={Campaign_Class__c} />
                }
            </div>

            {registrationDetails &&
                <EventInfoPanelRegistration />
            }
        </aside>
    )
}
