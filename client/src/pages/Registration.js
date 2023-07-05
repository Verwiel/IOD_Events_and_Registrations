import { useEffect } from "react"
import { stripeAPIKey } from "../config/Config"
import { Elements, StripeProvider } from "react-stripe-elements"
import { EventAndRegistrationLayout } from "../components/shared/EventAndRegistrationLayout"
import { useRegistration } from "../context/RegistrationProvider"
import { ProgramSelectionAndParticipants } from "../components/registrations/ProgramSelectionAndParticipants"
import { BillingInfo } from '../components/registrations/BillingInfo'
import { OrderReviewAndConfirmation } from '../components/registrations/OrderReviewAndConfirmation'
import { PaymentInfo } from '../components/registrations/PaymentInfo'

export const Registration = () => {
    const { validateInputs, windowReset, currentStep, orderDidProcess } = useRegistration()

	validateInputs()

	useEffect(() => {
		windowReset()
	}, [windowReset])

    return (
        <EventAndRegistrationLayout isRegistration={true}>
            <article>
                <aside className="event-registrations-content-body-progress">
                    <h3 className='text-body-sm'>
                        Personal Info
                    </h3>
                    <h3 className='text-body-sm' style={{backgroundColor: currentStep >= 3 && '#fdc743'}}>
                        Payment Info
                    </h3>
                    <h3 className='text-body-sm' style={{backgroundColor: currentStep >= 5 &&'#fdc743'}}>
                        Confirmation
                    </h3>
                </aside>
                <section className="event-registrations-content-body-steps">
                    {currentStep === 1 ? (
                        <ProgramSelectionAndParticipants />
                    ) : currentStep === 2 ? (
                        <OrderReviewAndConfirmation />	
                    ) : currentStep === 3 ? (
                        <BillingInfo />
                    ) : currentStep === 4 ? (
                        <OrderReviewAndConfirmation />
                    ) : currentStep === 5 ? (
                        <StripeProvider apiKey={stripeAPIKey}>
                            <Elements>
                                <PaymentInfo />
                            </Elements>
                        </StripeProvider>
                    ) : (
                        <OrderReviewAndConfirmation />
                    )}	
                </section>


                { orderDidProcess === false &&
                    <aside className='violator-text order-did-not-process-wrap'>
                        <p className="order-did-not-process">
                            Your order did not process successfully. Please try again or contact events@insideoutdev.com or 1-888-262-2448 for assistance. 
                        </p>
                    </aside>
                }
                {currentStep === 2 && <div className="registrations-white-space"></div>}
            </article>
        </EventAndRegistrationLayout>
    )
}
