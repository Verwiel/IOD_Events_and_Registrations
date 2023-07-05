import { useState } from 'react'
import { workshopPrice, certPrice, fullEventPrice, breakthroughsPrice } from '../../config/Config'
import { useEvents } from '../../context/EventProvider'
import { useRegistration } from '../../context/RegistrationProvider'
import { EventParticipantForm } from './EventParticipantForm'

export const ProgramSelectionAndParticipants = () => {
    const { handleAddParticipant, handleNextStep, participants, selectedEventType, confirmPreviousAttendance, selectProgram } = useRegistration()
    const { selectedEvent } = useEvents()
    const { Is_Workshop_Full__c, Is_T3_Full__c, Delivery_Format__c, Campaign_Class__c, workshop, certification, fullEvent } = selectedEvent;
    const [addAnotherParticipant, setAddAnotherParticipant] = useState(false)
    
	const handleAddParticipantNextStep = (ev) => {
		if (addAnotherParticipant === true) {
			handleAddParticipant(ev);
		}
		else {
			handleAddParticipant(ev);
			handleNextStep();
		}
	}

    const is3DayFull = ((Is_T3_Full__c && Is_Workshop_Full__c) || Is_T3_Full__c || Is_Workshop_Full__c)
	const is3DayActive = (fullEvent.IsActive || ( workshop.IsActive && certification.IsActive ))
	const is2DayActive = certification.IsActive || fullEvent.IsActive
	const is1DayActive = workshop.IsActive || fullEvent.IsActive
	const isVirtual = Delivery_Format__c === 'Virtual'
	const previousAttendanceDisplay = Campaign_Class__c === 'GROW Coaching Parent' ? 'GROW' : 'InsideOut'

    return (
        <section>
			<form onSubmit={handleAddParticipantNextStep}>
				<h3 className='registrations-headers'>Program Selection</h3>

				{selectedEvent.Campaign_Class__c === "Breakthroughs" ? 
					<section className='form-checks text-body'>
						<label htmlFor="IOC 2 Day Registration">
							<input
								type="radio"
								name="selectedEventId"
								id={selectedEvent.Id}
								value={+breakthroughsPrice}
								required={true}
								onChange={() => selectProgram(selectedEvent, selectedEvent, 'breakthroughs')}
							/>
							{" "}
							Breakthroughs Facilitator Certification: $
							{breakthroughsPrice}
						</label>
					</section>
				:
					<section className='form-checks text-body'>
						{(!is3DayFull && is3DayActive) &&
							<label htmlFor="IOC 3 Day Registration">
								<input
									type="radio"
									name="selectedEventId"
									id={fullEvent.Id}
									value={+fullEventPrice}
									required={!participants.length ? true : false}
									onChange={() => selectProgram(selectedEvent, selectedEvent.fullEvent, 'full-event')}
									// checked={selectedEventType === 'IOC&T3' ? true : false}
								/>
								{" "}
								{isVirtual ? 'Virtual Workshop + Virtual Certification' : 'Workshop + Certification (3 day)'}
								: ${fullEventPrice}
							</label>
						}
						{(!Is_T3_Full__c && is2DayActive) &&
							<>
								<label htmlFor="IOC 2 Day Registration">
									<input
										type="radio"
										name="selectedEventId"
										id={certification.Id}
										value={+certPrice}
										required={!participants.length ? true : false}
										onChange={() => selectProgram(selectedEvent, selectedEvent.certification, 'certification')}
										// Auto checked if its the only option
										// checked={
										// 	((workshop.IsActive === false) && (fullEvent.IsActive === false) && (certification.IsActive)) 
										// 	? true : null}
									/>
									{" "}
									{isVirtual ? 'Virtual Certification Only' : 'Certification Only (2 day)'}
									: ${certPrice}
								</label>

								<label htmlFor="confirmPreviousAttendance" className='form-checks-sub-check'>
									<input
										type="checkbox"
										name="confirmPreviousAttendance"
										onChange={confirmPreviousAttendance}
										required={selectedEventType === 'certification' ? true : false}
									/>
									*Yes, I have attended a {previousAttendanceDisplay} Coaching
									Workshop (required for certification)
								</label>
							</>
						}
						{(!Is_Workshop_Full__c && is1DayActive) &&
							<label htmlFor="IOC 1 Day Registration">
								<input
									type="radio"
									name="selectedEventId"
									id={workshop.Id}
									value={+workshopPrice}
									required={!participants.length ? true : false}
									onChange={() => selectProgram(selectedEvent, selectedEvent.workshop, 'workshop')}
									// Auto checked if its the only option
									// checked={
									// 	((workshop.IsActive) && (fullEvent.IsActive === false) && (certification.IsActive === false)) 
									// 	? true : null}
								/>
								{" "}
								{isVirtual ? 'Virtual Workshop' : 'Workshop (1 day)'}
								: ${workshopPrice}{" "}
							</label>
						}
					</section>
				}

				<EventParticipantForm />

				<nav>
					<button 
						onClick={() => setAddAnotherParticipant(true)} 
						className='salmon-button-small' 
						style={{backgroundColor: '#306095'}}
					>
						ADD ATTENDEE
					</button>
					<button 
						onClick={() => setAddAnotherParticipant(false)} 
						className='salmon-button-small'
					>
						FORWARD
					</button>
				</nav>
			</form>
        </section>
    )
}
