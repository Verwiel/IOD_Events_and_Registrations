import { useState, createContext, useContext } from 'react'
import axios from 'axios'
import { sanitizeData } from "../util/SanatizeData"
import { workshopPrice, certPrice, fullEventPrice, breakthroughsPrice } from '../config/Config'

const promoBaseURL = '/v1/iod/promocode';

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

    const [selectedProgram, setSelectedProgram] = useState({})
    const [programParent, setProgramParent] = useState({})


    const [participants, setParticipants] = useState([])
    const [defaultEventPrice, setDefaultEventPrice] = useState(0)
    const [promoCode, setPromoCode] = useState('')
    const [registrationEventDetails, setRegistrationEventDetails] = useState('')
    const [totalPrice, setTotalPrice] = useState(0)
    const [registrationSelectedEvent, setRegistrationSelectedEvent] = useState({})
    const [selectedEventId, setSelectedEventId] = useState('')
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
    const [billingFirstName, setBillingFirstName] = useState('')
    const [billingLastName, setBillingLastName] = useState('')
    const [billingEmail, setBillingEmail] = useState('')
    const [billingTitle, setBillingTitle] = useState('')
    const [billingCompany, setBillingCompany] = useState('')
    const [billingPhone, setBillingPhone] = useState('')
    const [billingStreetOne, setBillingStreetOne] = useState('')
    const [billingStreetTwo, setBillingStreetTwo] = useState('')
    const [billingCity, setBillingCity] = useState('')
    const [billingState, setBillingState] = useState('')
    const [billingCountry, setBillingCountry] = useState('United States')
    const [billingZipCode, setBillingZipCode] = useState('')
    const [billingPaymentMethod, setBillingPaymentMethod] = useState('Credit Card')
    const [editingParticipantIndex, setEditingParticipantIndex] = useState(null)
    const [orderConfirmationNumber, setOrderConfirmationNumber] = useState('')
    const [orderDidProcess, setOrderDidProcess] = useState(null)
    const [displayLoadingIcon, setDisplayLoadingIcon] = useState(false)
    const [addParticipant, setAddParticipant] = useState(defaultParticipant)

    const noPayment = () => {
        setBillingPaymentMethod('Invoice')
    }


    const toggleUseParticipantInfo = () => {
        const participant = participants[0]

        setUseParticipantInfo(!useParticipantInfo)
        setBillingFirstName(participant.firstName)
        setBillingLastName(participant.lastName)
        setBillingEmail(participant.email)
        setBillingTitle(participant.title)
        setBillingCompany(participant.company)
        setBillingPhone(participant.phone)
    }


    const cancelUseParticipantInfo = () => {
        setUseParticipantInfo(false)
    }


    // const handleChangeRegistration  = (e) => {
    //     let { name, value, type } = e.target
    //     value = sanitizeData(value)
    //     if(type === 'checkbox'){
    //         this.setState({ [name]: !this.state[name]})
    //     } else {
    //         this.setState({ [name]: value })
    //     }
    // }

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

            // let selectedChildBtEvent = this.state.registrationSelectedEvent
            // selectedChildBtEvent.Campaign_Class__c = 'Breakthroughs'
            // this.setState({  defaultEventPrice: breakthroughsPrice, pricePerParticipant: breakthroughsPrice, selectedEventType: 'breakthroughs', registrationEventDetails: 'InsideOut Breakthroughs Facilitator Certification', registrationSelectedEvent: selectedChildBtEvent })
        }
    }

    const confirmPreviousAttendance = () => {
        setConfirmHasPreviouslyAttended(true)
    }

    const handleChangeParticipant = (e) => {
        let { name, value, type } = e.target
        value = sanitizeData(value)
        
        let newParticipant = addParticipant
        setAddParticipant({
            ...newParticipant, 
            [name] : value
        })
    }


    const handleAddParticipant = (e) => {
        e.preventDefault()
        if(addParticipant.firstName.length > 0 ){
            let newParticipantList = [...participants, addParticipant]
            setParticipants(newParticipantList)
            setTotalPrice(pricePerParticipant * participants.length)
            setStripeTotalPrice((pricePerParticipant*participants.length) * 100)
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
        const participants = participants
        const editedParticipant = addParticipant
        participants.splice(index , 1, editedParticipant)
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
        let campaignClass = registrationSelectedEvent.Campaign_Class__c

        axios.get(`${promoBaseURL}/${promoCode}`)
        .then(res => {
            let promoCodeEventValidity = res.data[0].validFor

            if(promoCodeEventValidity === campaignClass){
                setIsPromocodeValid(true)
                setPromoCodeDataObject(res.data[0])
                
                applyPromoCode(res.data[0])
            } else {
                setIsPromocodeValid(false)
                setPromoCodeNotification('This promo code is not valid for the selected event')
            }
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
                        let newPrice = pricePerParticipant+codeToApply.value 
                        let updatedPrice;
                        newPrice >= 0 ? updatedPrice = newPrice : updatedPrice = 0

                        setPricePerParticipant(updatedPrice)
                        setAlreadyUsedPromoCode(true)
                        setTotalPrice(updatedPrice * participants.length)
                        setStripeTotalPrice((updatedPrice * participants.length) * 100)
                        setPromoCodeError('')
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
                if(selectedEventType === 'IOC&T3'){
                    newPrice = fullEventPrice
                } else if(selectedEventType === 'T3'){
                    newPrice = certPrice
                } else if(selectedEventType === 'IOC'){
                    newPrice = workshopPrice
                } else if(selectedEventType === 'breakthroughs'){
                    newPrice = breakthroughsPrice
                }

                setPricePerParticipant(newPrice)
                setTotalPrice(newPrice * participants.length)
                setStripeTotalPrice((newPrice * participants.length) * 100)
                setPromoCode('')
                setIsPromocodeValid(null)
                setAlreadyUsedPromoCode(false)
                setPromoCodeError(null)
            }
        })
        .catch(() => {
            //  The promo code was valid, but did not process removal.
            setPromoCodeError('Promo code did not remove.  Please try again.')
        })
    }


    const handleSelectCountry = (val) => {
        setBillingCountry(val)
        setBillingState('')
    }

    const toggleLoader = () => setDisplayLoadingIcon(!displayLoadingIcon)
    const windowReset = () =>  window.scrollTo(0, 320)
    const handleSelectState = (val) => setBillingState(val)


    const handleSubmitRegistration = (uniqueOrderNumber) => {
        setOrderConfirmationNumber(uniqueOrderNumber)
        setCustomRegistrationData()
    }


    const setCustomRegistrationData = () => {
        let eventCityState;
        let eventState;
        let eventCountry;
        let eventZipCode;

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
        
        if(registrationSelectedEvent.Campaign_Class__c === 'Breakthroughs'){
            eventCityState = registrationSelectedEvent.City__c 
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
                "salesforce_campaign_id" : selectedEventId , 
                "payment_type" : billingPaymentMethod , 
                "total_payment_amount" : totalPrice ,  // Payment value (in dollars)
                "price_per_participant" : pricePerParticipant ,
                "total_registered_participants" : participants.length , 
                "idempotency_key" : orderConfirmationNumber , 
                "zap_submission_iteration" : index+1 , // The current iteration of form to be submitted to zapier 
                "billing_info" :  billingInfo , 
                "billing_contact_email" : billingEmail,
                "classroom_link_1_day": registrationSelectedEvent.Classroom_Link_1_Day__c,
                "classroom_link_t3": registrationSelectedEvent.Classroom_Link_T3__c,
                "domain": participant.email.slice(participant.email.indexOf('@')+1),
            }
            let access = selectedEventType
            if(selectedEventType !== 'breakthroughs'){
                // currently all overflow events are for GROW Coaching, comment out the check and leave community = 'coaching' if this changes.
                if(programParent.Campaign_Class__c.includes("GROW")){
                    access = { grantGrowCoaching: true }
                } else {
                    access = { grantIoc: true }
                }
                registrationData["delivery_format"] = registrationSelectedEvent.Delivery_Format__c 
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
                promoCode, 
                registrationEventDetails, 
                totalPrice,
                currentStep,
                orderDidProcess,
                selectedProgram,
                selectedEventType,
                addParticipant,
                billingFirstName,
                billingLastName,
                billingEmail,
                billingCompany,
                billingTitle,
                billingPhone,
                billingStreetOne,
                billingStreetTwo,
                billingCity,
                billingState,
                billingZipCode,
                billingCountry,
                billingPaymentMethod,
                orderConfirmationNumber,
                orderDidProcess,
                promoCode,
                isPromocodeValid,
                checkPromoCode,
                removePromoCode,
                promoCodeError,
                promoCodeNotification,
                toggleUseParticipantInfo,
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
            }}>
            { children }
        </RegistrationContext.Provider>
    )
}
