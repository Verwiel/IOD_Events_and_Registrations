import { useState, useEffect } from 'react'
import axios from 'axios'
import { CardNumberElement, CardExpiryElement, CardCVCElement, injectStripe } from 'react-stripe-elements'
import { useRegistration } from '../../context/RegistrationProvider'
const shortuuid = require('shortid')
const stripeBaseURL = '/v1/iod/stripe'

const PaymentInfo = ({ stripe }) => {
    const { participants, billingEmail, selectedProgram, billingFirstName, billingLastName, pricePerParticipant, stripeTotalPrice, toggleLoader, handleSubmitRegistration, billingPaymentMethod, totalPrice, noPayment, selectedEventType, handleChangeRegistration, orderDidProcess, handleBackStep, displayLoadingIcon, handleNextStep } = useRegistration()
    const [cardError, setCardError] = useState("")
    const [stripeResponse, setStripeResponse] = useState(null)

    const setParticipantInfo = () => {
        let participantNames = []
        participants.forEach(participant => {
            participantNames.push(`${participant.firstName} ${participant.lastName}`)
        })
        return participantNames.toString()
    }
    
    const submitStripe = async (uniqueOrderNumber) => {
        let { token } = await stripe.createToken({ name: billingEmail })
        
        let registeredParticipants = setParticipantInfo()

        const stripeObject = {
            transactionToken: token.id,
            eventName: selectedProgram.Name,
            cardHolderFirstName: billingFirstName,
            cardHolderLastName: billingLastName,
            numberOfParticipants: participants.length,
            pricePerParticipant: pricePerParticipant,
            displayTotalPrice: pricePerParticipant * participants.length,
            stripeTotalPrice: stripeTotalPrice,
            orderConfirmationNumber: uniqueOrderNumber,
            registeredParticipants: registeredParticipants
        }

        await axios
            .post(`${stripeBaseURL}/charge`, stripeObject)
            .then((res) => {
                if (res.status === 200) {
                    setStripeResponse(200)
                    handleSubmitRegistration(uniqueOrderNumber)
                }else{
                    toggleLoader()
                    setCardError('There was a problem processing your payment. Please try again or contact 1-888-262-2448 for assistance.')
                }
            })
            .catch((err) => {
                setCardError(err)
                toggleLoader()
            })
    }

    const processCreditCardOrInvoice = (e) =>{
        e.preventDefault()
        toggleLoader()
        let uniqueOrderNumber = shortuuid.generate()

        if(billingPaymentMethod === 'Credit Card' && stripeResponse !== 200){
            submitStripe(uniqueOrderNumber)
        }
        if(billingPaymentMethod === 'Invoice' || stripeResponse === 200 ){
            handleSubmitRegistration(uniqueOrderNumber)
        }
    }

    useEffect(() => {
        if (totalPrice < 1) {
            noPayment()
        }
    }, [noPayment, totalPrice])

    return (
        <section>
            <h3 className='registrations-headers'>PAYMENT DETAILS</h3>
            <form onSubmit={ processCreditCardOrInvoice }>
                <section>
                    {(selectedEventType !=='IOC' &&  totalPrice > 1 ) &&
                        <div>
                            <label htmlFor="billingPaymentMethod">
                                Payment Method*
                            </label>
                            <select
                                name="billingPaymentMethod"
                                required
                                onChange={handleChangeRegistration}
                            >
                                <option value="">---</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="Invoice">Invoice</option>
                            </select>
                        </div>
                    }

                    {totalPrice < 1 && 
                        <p> Your order will be processd as a $0 invoice </p>
                    }

                    {(( billingPaymentMethod === "Credit Card" ) && (stripeTotalPrice > 0) && (!orderDidProcess)) &&
                        <div className="stripe-wrap">
                            <div className="stripe-card-element">
                                <label className="card-input">
                                    Card Number
                                </label> 
                                <div className="card-input-wrap">
                                    <CardNumberElement />
                                </div>
                                <label className="card-input">
                                    Expiration date
                                </label> 
                                <div className="card-input-wrap">
                                    <CardExpiryElement />
                                </div>
                                <label className="card-input">
                                    CVC
                                </label> 
                                <div className="card-input-wrap"> 
                                    <CardCVCElement />
                                </div>
                            </div>
                        </div>
                    }
                    
                    {cardError && <div className='violator-text'> Your credit card did not process successfully.  Please check your details and try again.  If the problem persists please contact events@insideoutdev.com or 1-888-262-2448 for assistance. </div>}
                </section>
                
                <section>
                    <h3 className='registrations-headers'>CANCELLATION POLICY</h3>
                    <div className='text-body'>
                        <p style={{fontWeight: '300'}}>
                            Cancellations of a public registration received
                            30 calendar days prior to the program are
                            eligible for a 100% tuition refund. Cancellation
                            requests received between 30 and 14 calendar
                            days prior to the program are eligible for a 50%
                            tuition refund. Cancellation requests received
                            less than 14 calendar days prior to the program
                            or no shows will not be eligible for a tuition refund.
                        </p>
                        <p style={{fontWeight: '300'}}>
                            Reschedule/transfer fee: Participants may
                            reschedule or transfer at no additional charge
                            30 days or more prior to the program.
                            Reschedule/transfer requests less than 30 days
                            prior to the program will incur a $50 transfer fee.
                        </p>

                        <div>
                            <input
                                type="checkbox"
                                name="cancellationAgreement"
                                required
                                onChange={handleChangeRegistration}
                            />
                            <label htmlFor="cancellationAgreement">
                                * I agree to the cancellation policy.
                            </label>
                        </div>
                    </div>
                </section>

                <nav>
                    <button onClick={handleBackStep} className='salmon-button-small'>BACK</button>
                    {displayLoadingIcon ?
                        // <Loader />
                        <h1>Loading...</h1>
                        :
                        <button style={{backgroundColor: '#306095'}} className='salmon-button-small'> COMPLETE ORDER </button>
                    }
                </nav>
            </form>
            { orderDidProcess && handleNextStep() }
        </section>
    )
}

export default injectStripe(PaymentInfo)
