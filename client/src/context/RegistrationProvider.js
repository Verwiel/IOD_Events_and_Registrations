import { useState, createContext, useContext } from 'react'
import axios from 'axios'
import { sanitizeData } from "../util/SanatizeData"
import { workshopPrice, certPrice, fullEventPrice, breakthroughsPrice } from '../config/Config'

const promoBaseURL = '/promocode';

const RegistrationContext = createContext()
export const useRegistration = () => useContext(RegistrationContext)

export const RegistrationProvider = ({ children }) => {
    const defaultParticipant = {
        firstName : '',
        lastName : '',
        email : '',
        title : '',
        company : '',
        phone : '',
    }

    const defaultBilling = {
        billingFirstName: '',
        billingLastName: '',
        billingEmail: '',
        billingTitle: '',
        billingCompany: '',
        billingPhone: '',
        billingStreetOne: '',
        billingStreetTwo: '',
        billingCity: '',
        billingState: '',
        billingCountry: 'United States',
        billingZipCode: '',
        promoCode: '',
        billingPaymentMethod: 'Credit Card'
    }

    const [selectedProgram, setSelectedProgram] = useState({})
    const [programParent, setProgramParent] = useState({})


    const [participants, setParticipants] = useState([])
    const [defaultEventPrice, setDefaultEventPrice] = useState(0)
    const [registrationEventDetails, setRegistrationEventDetails] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [selectedEventType, setSelectedEventType] = useState('')
    const [pricePerParticipant, setPricePerParticipant] = useState(0)
    const [stripeTotalPrice, setStripeTotalPrice] = useState(100)
    const [confirmHasPreviouslyAttended, setConfirmHasPreviouslyAttended] = useState(false)
    // const [additionalParticipants, setAdditionalParticipants] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [promoCodeDataObject, setPromoCodeDataObject] = useState({})
    const [isPromocodeValid, setIsPromocodeValid] = useState(null)
    const [alreadyUsedPromoCode, setAlreadyUsedPromoCode] = useState(false)
    const [promoCodeError, setPromoCodeError] = useState(null)
    const [promoCodeNotification, setPromoCodeNotification] = useState('')
    const [isShowingEditUserModal, setIsShowingEditUserModal] = useState(false)
    const [isShowingEditBillingContactModal, setIsShowingEditBillingContactModal] = useState(false)
    const [isShowingEditBillingAddressModal, setIsShowingEditBillingAddressModal] = useState(false)
    const [isShowingDeleteParticipantModal, setIsShowingDeleteParticipantModal] = useState(false)
    const [useParticipantInfo, setUseParticipantInfo] = useState(false)
    const [billingForm, setBillingForm] = useState(defaultBilling)
    const [editingParticipantIndex, setEditingParticipantIndex] = useState(null)
    const [orderConfirmationNumber, setOrderConfirmationNumber] = useState('')
    const [orderDidProcess, setOrderDidProcess] = useState(null)
    const [displayLoadingIcon, setDisplayLoadingIcon] = useState(false)
    const [addParticipant, setAddParticipant] = useState(defaultParticipant)
    const [appliedPromoCode, setAppliedPromoCode] = useState('')

    const billingOnChange = (e) => {
        const { name, value } = e.target
        setBillingForm({
            ...billingForm,
            [name]: value
        })
    }

    const useParticipantForBilling = (e) => {
        const { checked } = e.target
        if(checked){
            const participant = participants[0]
            setUseParticipantInfo(true)
            setBillingForm({
                ...billingForm,
                billingFirstName: participant.firstName,
                billingLastName: participant.lastName,
                billingEmail: participant.email,
                billingTitle: participant.title,
                billingCompany: participant.company,
                billingPhone: participant.phone,
            })
        } else {
            setUseParticipantInfo(false)
            setBillingForm(defaultBilling)
        }
    }

    const noPayment = () => {
        setBillingForm({
            ...billingForm,
            billingPaymentMethod: 'Invoice'
        })
    }

    const cancelUseParticipantInfo = () => {
        setUseParticipantInfo(false)
    }

    const selectProgram = (parent, child, type) => {
        setSelectedProgram(child)
        setProgramParent(parent)
        setSelectedEventType(type)

        if(type === 'workshop'){
            setDefaultEventPrice(workshopPrice)
            setPricePerParticipant(workshopPrice)
            setRegistrationEventDetails('Workshop')
            setTotalPrice(workshopPrice * participants.length)

        } else if (type === 'certification'){
            setDefaultEventPrice(certPrice)
            setPricePerParticipant(certPrice)
            setRegistrationEventDetails('Certification')
            setTotalPrice(certPrice * participants.length)

        } else if(type === 'full-event'){
            setDefaultEventPrice(fullEventPrice)
            setPricePerParticipant(fullEventPrice)
            setRegistrationEventDetails('Workshop + Certification')
            setTotalPrice(fullEventPrice * participants.length)

        } else if(type === 'breakthroughs'){
            setDefaultEventPrice(breakthroughsPrice)
            setPricePerParticipant(breakthroughsPrice)
            setRegistrationEventDetails('InsideOut Breakthroughs Facilitator Certification')
            setTotalPrice(breakthroughsPrice * participants.length)
        }
    }

    const confirmPreviousAttendance = () => {
        setConfirmHasPreviouslyAttended(true)
    }

    const handleChangeParticipant = (e) => {
        let { name, value } = e.target
        value = sanitizeData(value)
        
        let newParticipant = addParticipant
        setAddParticipant({
            ...newParticipant, 
            [name] : value
        })
    }


    const handleAddParticipant = (e) => {
        e.preventDefault()
        console.log('hit')
        if(addParticipant.firstName.length > 0 ){
            console.log('hit 2')
            let newParticipantList = [...participants, addParticipant]
            setParticipants(newParticipantList)
            setTotalPrice(pricePerParticipant * newParticipantList.length)
            setStripeTotalPrice((pricePerParticipant * newParticipantList.length) * 100)
        }

        setAddParticipant(defaultParticipant)
    }


    const toggleEditParticipantModal = (index) => {
        if(index >= 0){
            setIsShowingEditUserModal(!isShowingEditUserModal)
            setEditingParticipantIndex(index)
            setAddParticipant({
                firstName : participants[index].firstName,
                lastName : participants[index].lastName,
                email : participants[index].email,
                company : participants[index].company,
                phone : participants[index].phone,
                title : participants[index].title
            })
        } else {
            setIsShowingEditUserModal(!isShowingEditUserModal)
            setEditingParticipantIndex(null)
        }
    }


    const handleEditParticipant = (e) => {
        const { name, value } = e.target;

        setAddParticipant({
            ...addParticipant,
            [name] : value
        })
    }


    const handleUpdateEditedParticipant = () => {
        const index = editingParticipantIndex
        const existingParticipants = participants
        const editedParticipant = addParticipant
        existingParticipants.splice(index , 1, editedParticipant)
        toggleEditParticipantModal()
    }

    const toggleEditBillingContactModal = () => {
        setIsShowingEditBillingContactModal(!isShowingEditBillingContactModal)
    }

    const toggleEditBillingAddressModal = () => {
        setIsShowingEditBillingAddressModal(!isShowingEditBillingAddressModal)
    }

    const handleDeleteParticipant = (index) => {
        participants.splice(index, 1)
        
        setParticipants(participants)
        setTotalPrice(pricePerParticipant * participants.length)
        setStripeTotalPrice((pricePerParticipant * participants.length) * 100)
    }

    const toggleDeleteParticipantModal = (index) => {
        if(index >= 0){
            setIsShowingDeleteParticipantModal(!isShowingDeleteParticipantModal)
            setEditingParticipantIndex(index)
            setAddParticipant({
                firstName : participants[index].firstName,
                lastName : participants[index].lastName,
            })
        } else {
            setIsShowingDeleteParticipantModal(!isShowingDeleteParticipantModal)
            setEditingParticipantIndex(null)
        }
    }


    const handleNextStep = () => {
        let currentStepState = currentStep;
        setCurrentStep(currentStepState += 1)
    }


    const handleBackStep = () => {
        let currentStepState = currentStep;
        setCurrentStep(currentStepState -= 1)
        setOrderDidProcess(null)
    }


    const checkPromoCode = (e) => {
        e.preventDefault()
        let campaignClass = selectedProgram.Campaign_Class__c

        axios.get(`${promoBaseURL}/${billingForm.promoCode}/${campaignClass}`)
        .then(res => {
            console.log(res.data)
            setIsPromocodeValid(true)
            setPromoCodeDataObject(res.data)
            applyPromoCode(res.data)
        })
        .catch(() => {
            setIsPromocodeValid(false)
            setPromoCodeNotification('Something broke or that promo code was invalid.  Please try again.')
        })
    }

    const applyPromoCode = (codeToApply) => {
        //  Check if promo code has already been applied to order
        if(!alreadyUsedPromoCode  ){
            //  Check if there are valid redemptions left with that promo code or if there are limits on redemptions
            if( (codeToApply.timesUsed < codeToApply.maxUsage) || codeToApply.maxUsage === null ){
                // Process promo code
                codeToApply.timesUsed += 1
                axios.put(`${promoBaseURL}/${codeToApply.id}`, codeToApply)
                .then(res => {
                    if(res.status === 200){
                        let newPrice = pricePerParticipant - codeToApply.value 
                        let updatedPrice;
                        newPrice >= 0 ? updatedPrice = newPrice : updatedPrice = 0

                        setPricePerParticipant(updatedPrice)
                        setAlreadyUsedPromoCode(true)
                        setTotalPrice(updatedPrice * participants.length)
                        setStripeTotalPrice((updatedPrice * participants.length) * 100)
                        setPromoCodeError('')
                        setAppliedPromoCode(codeToApply.name)
                    }
                })
                .catch(() => {
                    //  The promo code was valid, but did not process.
                    setPromoCodeError('Promo code did not process.  Please try again.')
                })
            } else {
                setPromoCodeError('This promo code is expired or has already been redeemed.')
            }
        } else {
            setPromoCodeError('You may only apply one promo code per order.')
        }
    }

    const removePromoCode = () => {
        let promoCodeObject = promoCodeDataObject
        promoCodeObject.timesUsed -= 1
        axios.put(`${promoBaseURL}/${promoCodeDataObject.id}`, promoCodeObject)
        .then(res => {
            if(res.status === 200){
                let newPrice;
                if(selectedEventType === 'full-event'){
                    newPrice = fullEventPrice
                } else if(selectedEventType === 'certification'){
                    newPrice = certPrice
                } else if(selectedEventType === 'workshop'){
                    newPrice = workshopPrice
                } else if(selectedEventType === 'breakthroughs'){
                    newPrice = breakthroughsPrice
                }

                setPricePerParticipant(newPrice)
                setTotalPrice(newPrice * participants.length)
                setStripeTotalPrice((newPrice * participants.length) * 100)
                setIsPromocodeValid(null)
                setAlreadyUsedPromoCode(false)
                setPromoCodeError(null)
                setBillingForm({
                    ...billingForm,
                    promoCode: ''
                })
                setAppliedPromoCode('')
            }
        })
        .catch(() => {
            //  The promo code was valid, but did not process removal.
            setPromoCodeError('Promo code did not remove.  Please try again.')
        })
    }


    const handleSelectCountry = (val) => {
        setBillingForm({
            ...billingForm,
            billingState: '',
            billingCountry: val
        })
    }

    const handleSelectState = (val) => {
        setBillingForm({
            ...billingForm,
            billingState: val
        })
    }

    const toggleLoader = () => setDisplayLoadingIcon(!displayLoadingIcon)
    const windowReset = () =>  window.scrollTo(0, 320)


    const handleSubmitRegistration = (uniqueOrderNumber) => {
        setOrderConfirmationNumber(uniqueOrderNumber)
        setCustomRegistrationData()
    }


    const setCustomRegistrationData = () => {
        let eventCityState;
        let eventState;
        let eventCountry;
        let eventZipCode;

        const {
            billingFirstName,
            billingLastName,
            billingEmail,
            billingCompany,
            billingPhone,
            billingStreetOne,
            billingStreetTwo,
            billingCity,
            billingState,
            billingCountry,
            billingZipCode
        } = billingForm

        if(!programParent.State__c){
            eventState = ' '
        }else {
            eventState = programParent.State__c
        }

        if(!programParent.Zip_Code__c){
            eventZipCode = ' '
        } else {
            eventZipCode = programParent.Zip_Code__c
        }

        if(!programParent.Event_Country__c || programParent.Event_Country__c === 'United States'){
            eventCountry = ' '
        } else {
            eventCountry = programParent.Event_Country__c
        }

        let eventVenue; 
        let eventAddress;

        programParent.Venue__c === null ? eventVenue = 'TBD' : eventVenue = programParent.Venue__c
        programParent.Street_Address__c === null ? eventAddress = 'TBD' : eventAddress = programParent.Street_Address__c
        
        if(selectedProgram.Campaign_Class__c === 'Breakthroughs'){
            eventCityState = selectedProgram.City__c 
        } else {
            eventCityState = `${programParent.City__c}, ${eventState} ${eventCountry}${eventZipCode}`
        }

        let billingInfo = ''
        if(!billingStreetTwo){
            billingInfo =   `${billingCompany} 
                            ${billingFirstName} ${billingLastName}
                            ${billingEmail}
                            ${billingPhone}
                            ${billingStreetOne}
                            ${billingCity}, ${billingState}, ${billingZipCode}
                            ${billingCountry} `
        } else {
            billingInfo =   `${billingCompany} 
                            ${billingFirstName} ${billingLastName}
                            ${billingEmail}
                            ${billingPhone}
                            ${billingStreetOne}
                            ${billingStreetTwo}
                            ${billingCity}, ${billingState}, ${billingZipCode}
                            ${billingCountry} `
        }
        buildRegistrationData(eventCityState, eventVenue, eventAddress, billingInfo)
    }


    //  Use this when we eliminate hubspot and want to pass data directly to Zapier
    const buildRegistrationData = ( eventCityState, eventVenue, eventAddress, billingInfo) => {

        const {
            billingEmail,
            billingStreetOne,
            billingStreetTwo,
            billingCity,
            billingState,
            billingCountry,
            billingZipCode,
            billingPaymentMethod
        } = billingForm

        let pendingPromises = []
        participants.forEach((participant, index) => {
            let registrationData = {
                "email" : participant.email , 
                "firstname" : participant.firstName , 
                "lastname" : participant.lastName , 
                "company" : participant.company , 
                "phone" : participant.phone , 
                "jobtitle" : participant.title ,
                "address" :  billingStreetOne + billingStreetTwo ,
                "city" : billingCity ,
                "state" : billingState ,
                "country" : billingCountry, 
                "zip" : billingZipCode ,
                "salesforce_campaign_id" : selectedProgram.Id, 
                "payment_type" : billingPaymentMethod , 
                "total_payment_amount" : totalPrice ,  // Payment value (in dollars)
                "price_per_participant" : pricePerParticipant ,
                "total_registered_participants" : participants.length , 
                "idempotency_key" : orderConfirmationNumber , 
                "zap_submission_iteration" : index+1 , // The current iteration of form to be submitted to zapier 
                "billing_info" :  billingInfo , 
                "billing_contact_email" : billingEmail,
                "classroom_link_1_day": selectedProgram.Classroom_Link_1_Day__c,
                "classroom_link_t3": selectedProgram.Classroom_Link_T3__c,
                "domain": participant.email.slice(participant.email.indexOf('@')+1),
            }

            if(selectedEventType !== 'breakthroughs'){
                // currently all overflow events are for GROW Coaching, comment out the check and leave community = 'coaching' if this changes.
                registrationData["delivery_format"] = selectedProgram.Delivery_Format__c 
                registrationData["registration_event_details"] = registrationEventDetails 
                registrationData["event_venue"] = eventVenue  
                registrationData["event_address"] = eventAddress 
                registrationData["event_city_state_zip"] = eventCityState 
            } 
            pendingPromises.push(submitRegistration(registrationData))
        })
        Promise.all(pendingPromises)
    }

    //  Sends all the registration data to Zapier via API calls to inject into Salesforce
    const submitRegistration = async (registrationData) => {
        console.log(registrationData) // For Logrocket evaluation. Also captured in the server log via the route below.

        let routerEndpoint = '/v1/registrations/public-program'

        await axios.post( routerEndpoint , registrationData )
        .then(() => {
            setOrderDidProcess(true)
            setDisplayLoadingIcon(false)
        })
        .catch(() => {
            setOrderDidProcess(false)
            setDisplayLoadingIcon(false)
        })
    }

    const validateInputs = () => {
        let inputs = document.querySelectorAll("input, select, textarea")

        inputs.forEach(input => {
            input.addEventListener(
            "invalid",
            () => {
                input.classList.add("error");
            },
            false
            )
        })
    }


    return (
        <RegistrationContext.Provider 
            value={{
                participants, 
                defaultEventPrice,
                registrationEventDetails, 
                totalPrice,
                currentStep,
                orderDidProcess,
                selectedProgram,
                selectedEventType,
                addParticipant,
                orderConfirmationNumber,
                isPromocodeValid,
                checkPromoCode,
                removePromoCode,
                promoCodeError,
                promoCodeNotification,
                appliedPromoCode,
                displayLoadingIcon,
                useParticipantInfo,
                handleSelectCountry,
                handleSelectState,
                toggleLoader,
                toggleEditBillingContactModal,
                toggleEditBillingAddressModal,
                cancelUseParticipantInfo,
                handleChangeParticipant,
                selectProgram,
                confirmPreviousAttendance,
                validateInputs, 
                windowReset,
                handleBackStep,
                handleNextStep, 
                handleAddParticipant, 
                noPayment,
                handleSubmitRegistration,


                billingOnChange,
                billingForm,
                useParticipantForBilling
            }}>
            { children }
        </RegistrationContext.Provider>
    )
}
