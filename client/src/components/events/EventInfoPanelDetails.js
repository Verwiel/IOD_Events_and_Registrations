import { Link } from "react-router-dom"
import { useEvents } from "../../context/EventProvider"
import { workshopPrice, certPrice, fullEventPrice, breakthroughsPrice } from '../../config/Config'

export const EventInfoPanelDetails = () => {
    const { selectedEvent } = useEvents()
    const {
		Id,
        Campaign_Class__c,
        workshop,
        certification,
        fullEvent
	} = selectedEvent;

    return (
        <>
            <section>
                <h4>TUITION</h4>
                <ul className='registrations-and-event-details-panel-tuition'>
                    {(fullEvent.IsActive || ( workshop.IsActive && certification.IsActive )) &&
                        <>
                            <li>
                                <span>
                                    <strong>Workshop + Certification (3 day) </strong>
                                    ${fullEventPrice}
                                </span>
                                <span>Best value to get certified! A $300 savings.</span>
                            </li>
                        </>
                    }

                    {(certification.IsActive || fullEvent.IsActive) &&
                        <li>
                            <span><strong>Certification Only (2 day) </strong>${certPrice}</span>
                            <span>Previous workshop attendance required.</span>
                            
                        </li>
                    }
                        
                    {(workshop.IsActive || fullEvent.IsActive) &&
                        <li>
                            <span><strong>Workshop Only (1 day) </strong>${workshopPrice}</span>
                        </li>
                    }

                    {Campaign_Class__c === 'Breakthroughs' &&
                        <li>
                            <span><strong>Certification: </strong>${breakthroughsPrice}</span>
                        </li>
                    }
                </ul>
            </section>
            <section>
                <p className='desktop-only'>Contact us at <a href='tel:1-888-262-2448'>888.262.2448</a> for pricing on group and evaluator rates.</p>

                <Link to={`/register/${Id}`}>
                    <button className='salmon-button'>REGISTER NOW</button>
                </Link>
            </section>
        </>
    )
}
