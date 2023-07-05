import { useState, useEffect } from 'react'
import { useRegistration } from '../../context/RegistrationProvider'

export const EventInfoPanelRegistration = () => {
    const { participants, defaultEventPrice, registrationEventDetails, totalPrice, appliedPromoCode } = useRegistration()

    const [promoDeduction, setPromoDeduction] = useState()
    const tuitionParticipantList = participants.map((person) => {
		const index = participants.indexOf(person)
		return (
			<li key={`Participant-${index}`} index={index}>
                {person.firstName} {person.lastName}
			</li>
        )
	})
	
	useEffect(() => {
		let findPromoDeduction = (defaultEventPrice * participants.length) - totalPrice
		setPromoDeduction(findPromoDeduction)
	}, [defaultEventPrice, participants.length, totalPrice, promoDeduction])

    // console.log(participants.length)
    // console.log(defaultEventPrice)
    // console.log(totalPrice)

    return (
        <>
            {participants.length > 0 &&
                <div className='registrations-and-event-details-panel-tuition-registration'>
                    <header>
                        <h3 className='registrations-headers'>TUITION DETAILS</h3>
                    </header>
                    
                    <section>
                        <span>
                            <p>({tuitionParticipantList.length}) {registrationEventDetails}</p>
                            <p>${defaultEventPrice}</p>
                        </span>
                    </section>

                    <section>
                        <ul>
                            {tuitionParticipantList} 
                        </ul>
                    </section>

                    {promoDeduction > 0 &&
                        <section>
                            <span>
                                <p>Promo: {appliedPromoCode}</p>
                                <p>(${promoDeduction})</p>
                            </span>
                        </section>
                    }
        
                    <section>
                        <span style={{ borderTop: '1px solid black', paddingTop: '5px'}}>
                            <p>Subtotal:</p>
                            <p>${totalPrice}</p>
                        </span>
                    </section>
                </div>
            }
        </>
    )
}
