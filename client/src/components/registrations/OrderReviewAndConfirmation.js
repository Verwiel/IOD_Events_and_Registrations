import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import OrderConfirmationImage from '../../assets/order-confirmation.svg'
import { useRegistration } from '../../context/RegistrationProvider'
import { useEvents } from '../../context/EventProvider'
import { RegexTimeZone } from '../../util/RegexTimeZone'

export const OrderReviewAndConfirmation = () => {
    const { selectedEventType } = useEvents()
    const { 
        currentStep, 
        selectedProgram, 
        participants, 
        orderConfirmationNumber,
        toggleEditBillingContactModal,
        toggleEditBillingAddressModal,
        defaultEventPrice, 
        totalPrice, 
        toggleEditParticipantModal, 
        toggleDeleteParticipantModal,
        registrationEventDetails,
        handleBackStep,
        handleNextStep,
		billingForm,
		appliedPromoCode
    } = useRegistration()

	const {
        billingFirstName,
        billingLastName,
        billingEmail,
        billingTitle,
        billingCompany,
        billingPhone,
        billingStreetOne,
        billingStreetTwo,
        billingCity,
        billingState,
        billingZipCode
    } = billingForm


    const { Delivery_Format__c, City__c, State__c, Time_Zone__c, X1_Day_Start_DateTime__c, X2_Day_Start_date_time__c, X3_Day_End_date_time__c, Campaign_Class__c } = selectedProgram;

	const promoDeduction = (defaultEventPrice * (participants.length)) - totalPrice
	const reviewLocation = Delivery_Format__c === 'Virtual' ? `Virtual Classroom - ${RegexTimeZone(Time_Zone__c)}` : `${City__c}, ${State__c}`

    const reviewParticipants = participants.map((person) => {
		const index = participants.indexOf(person)
		return (
			<ul key={`Participant-${index}`} index={index} className='text-body'>
				<li>
					<p>Name: </p>
					<strong>{person.firstName} {person.lastName}</strong>
				</li>

				<li>
					<p>Email:</p>
					{person.email}
				</li>
				<li>
					<p>Company:</p>
					{person.company}
				</li>
				<li>
					<p>Title:</p>
					{person.title}
				</li>
				<li>
					<p>Phone:</p>
					{person.phone}
				</li>
				{( currentStep === 2 || currentStep === 4 ) &&
					<li>
						<aside>
							<button onClick={() => toggleEditParticipantModal(index)}>
								<FontAwesomeIcon
									icon={faEdit}
									title='Edit Participant'
								/>
							</button>
							{participants.length > 1 && 
								<button style={{ backgroundColor: '#EF493E' }} onClick={() => toggleDeleteParticipantModal(index)}>
									<FontAwesomeIcon
										icon={faTrashAlt}
										title='Delete Participant'
									/>
								</button>
							}
						</aside>
					</li>
				}
			</ul>
        )
	})

    return (
        <section>
			{/* <EditParticipantModal />
			<EditBillingContactModal />
			<EditBillingAddressModal />
			<DeleteParticipantModal /> */}

			{/* Confirmation */}
			{( currentStep !== 2 && currentStep !== 4 ) && 
				<div>
					<article className='event-registrations-confirmation-banner'>
						<img src={OrderConfirmationImage} alt="Order Completed"/>
						<span className='text-body'>
							<p>In preparation for your workshop, complete our simple five-step process to make sure you get the most from your InsideOut Coaching experience.</p>
							<p>Keep an eye on your inbox for important information and instructions about your workshop and how to prepare.</p>
						</span>
					</article>

					<section>
						<h3 className='registrations-headers'>Registration Complete</h3>
						<p className='text-body'>Thank you for registering. You will receive an order confirmation email shortly. All registered participants will receive an email detailing important workshop preparation information and instructions. If you don't receive these emails within the hour, please check your junk folder and add InsideOut Development to your email contact list.</p>
						<p className='text-body'>For additional support, contact <a href="mailto:events@insideoutdev.com">events@insideoutdev.com</a> or <a href='tel:1-888-262-2448'>888-262-2448</a>.
						</p>
						<button className='salmon-button-small' style={{margin: '30px 0 10px 0', alignSelf: 'flex-start'}} onClick={() => window.print()}>PRINT</button>
					</section>
				</div>
			}
			
			<section>
				<h3 className='registrations-headers'>Review</h3>
				{Campaign_Class__c !== 'Breakthroughs' ?
					<ul className='text-body'>
						<li>
							<strong>{reviewLocation}</strong>
						</li>
						<li>
							{selectedEventType} {registrationEventDetails}
						</li>
						<li>
							{registrationEventDetails === 'Workshop' ? 
								<Moment format="dddd, ll">{X1_Day_Start_DateTime__c}</Moment>
								: 
								registrationEventDetails === 'Certification' ?
								<>
									<Moment format="dddd, ll">{X2_Day_Start_date_time__c}</Moment>{' - '}<Moment format="dddd, ll">{X3_Day_End_date_time__c}</Moment>
								</>
								: 
								<>
									<Moment format="dddd, ll">{X1_Day_Start_DateTime__c}</Moment>{' - '}<Moment format="dddd, ll">{X3_Day_End_date_time__c}</Moment>
								</>
							}
						</li>
					</ul>
				:
					<ul className='text-body'>
						<li>
							<strong>Online</strong>
						</li>
						<li>
							{registrationEventDetails}
						</li>
						<li>
							<Moment format="dddd, ll">{X2_Day_Start_date_time__c}</Moment>
						</li>
					</ul>
				}
			</section>

            {(currentStep === 2 || currentStep === 4 || currentStep === 6 ) &&
				<section>
					<h3 className='registrations-headers'>Registered Participants</h3>
					{reviewParticipants}
				</section>
			}

			{(currentStep === 4 || currentStep === 6 )&&
				<section>
					<h3 className='registrations-headers'>Billing Information:</h3>
					<ul className='text-body'>
						<li>
							<p>Name:</p>
							<strong>{billingFirstName} {billingLastName}</strong>
						</li>
						<li>
							<p>Email:</p>
							{billingEmail}
						</li>
						<li>
							<p>Company:</p>
							{billingCompany}
						</li>
						<li>
							<p>Title:</p>
							{billingTitle}
						</li>
						<li>
							<p>Phone:</p>
							{billingPhone}
						</li>
						{currentStep === 4 &&
							<li>
								<aside>
									<button>
										<FontAwesomeIcon
											icon={faEdit}
											title='Edit Billing'
											onClick={toggleEditBillingContactModal}
										/>
									</button>
								</aside>
							</li>
						}
					</ul>

					<ul className='text-body'>
						<li>
							<p>Address:</p>
							{billingStreetOne} {billingStreetTwo}
						</li>
						<li>
							<p>City:</p>
							{billingCity}
						</li>
						<li>
							<p>State:</p>
							{billingState}
						</li>
						<li>
							<p>Zipcode:</p>
							{billingZipCode}
						</li>
						{currentStep === 4 &&
							<li>
								<aside>
									<button>
										<FontAwesomeIcon
											icon={faEdit}
											title='Edit Billing'
											onClick={toggleEditBillingAddressModal}
										/>
									</button>
								</aside>
							</li>
						}
					</ul>
				</section>
			}
			{currentStep === 6 && 
				<section>
					<h3 className='registrations-headers'>Payment Information</h3>
					<ul className='text-body'>
						<li>
							<span style={{ fontWeight: '600' }}>Order ID:</span>
						</li>
						<li style={{ marginBottom: '10px' }}>
							<span>{orderConfirmationNumber}</span>
						</li>
						<li style={{ marginBottom: '10px' }}>
							<span style={{ fontWeight: '600' }}>Event: ({participants.length}) {registrationEventDetails}{' '} ${defaultEventPrice}</span>
						</li>
						
						<li style={{ marginBottom: '10px' }}>
							<span style={{ fontWeight: '600' }}>Promo: {appliedPromoCode}{' '} (${promoDeduction})</span>
						</li>
						
						<li style={{ marginBottom: '10px' }}>
							<span style={{ fontWeight: '600' }}>Total:{' '}${totalPrice} </span>
						</li>
						
						<li style={{ marginBottom: '10px' }}>
							<span style={{ fontWeight: '600' }}>Transaction Date:{' '}<Moment format="LL"></Moment></span>
						</li>
					</ul>
				</section>
			}

			{(currentStep === 2 || currentStep === 4 ) ?
				<nav>
					<button className='salmon-button-small' onClick={handleBackStep}>BACK</button>
					<button className='salmon-button-small' onClick={handleNextStep}>FORWARD</button>
				</nav>
				:
				<>
					<div className='text-body'>
						<p>Questions about your registration?</p>
						<p> Contact us at <a href="mailto:events@insideoutdev.com">events@insideoutdev.com</a> or <a href='tel:1-888-262-2448'>888-262-2448</a></p>
						<button className='salmon-button-small' style={{marginTop: '10px'}} onClick={() => window.print()}>PRINT</button>
					</div>
					<nav>
						<Link to='/events'><button style={{backgroundColor: '#2E5597'}} className='salmon-button-small'>DONE</button></Link>
					</nav>
				</>
			}
        </section>
    )
}
