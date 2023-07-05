import { useEffect } from 'react'
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRegistration } from '../../context/RegistrationProvider'

export const BillingInfo = () => {
    const { 
        participants,
        handleNextStep,
        handleBackStep,
        cancelUseParticipantInfo,
        promoCode,
        isPromocodeValid,
        checkPromoCode,
        removePromoCode,
        promoCodeError,
        promoCodeNotification,
        toggleUseParticipantInfo,
        useParticipantInfo,
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
        handleSelectCountry,
        handleSelectState,
        handleChangeRegistration,
    } = useRegistration()

    const participant = participants[0]

	useEffect(() => {
		return () => cancelUseParticipantInfo()
	}, [cancelUseParticipantInfo])

    // if promo code is entered makes sure its valid then sends you to the next step,
	// if you empty the input and click next it will let you continue
	// BUG: have to click next twice if reentering a valid promo code. 
	const handleAddPromoNextStep = (e) => {
		e.preventDefault()
		if (promoCode.length > 0) {
			checkPromoCode(e);
			if (isPromocodeValid === true) {
				handleNextStep();
			} 
		} else if (!promoCode){
			handleNextStep();
		}
	}

	const handleSetNextStep = (e) => {
		e.preventDefault()
		handleNextStep()
	}

    return (
        <section>
            <form onSubmit={!promoCode ? handleSetNextStep : handleAddPromoNextStep}>
                <section>
                    <h3 className='registrations-headers'>PROMO CODE</h3>
                    <div className='form-single-field text-body'>
                        <input
                            type="text"
                            name="promoCode"
                            onChange={handleChangeRegistration}
                            value={promoCode}
                            autoComplete="autocomplete_off"
                        />
                        <button type="button" 
                            className='salmon-button-small'
                            onClick={checkPromoCode}
                            disabled={isPromocodeValid ? true : false}
                            style={{padding: '2px 8px', backgroundColor: isPromocodeValid && 'green'}}
                        >
                            {isPromocodeValid ? 'APPLIED' : 'APPLY'}
                        </button>
                    </div>
                    {isPromocodeValid && 
                        <div>
                            {promoCode}
                            <FontAwesomeIcon onClick={removePromoCode} icon={"times"} style={{margin: '5px 0 0 5px', cursor: 'pointer'}}/>
                        </div>
                    }
                    {promoCodeError && <div className="error-warning" style={{marginTop: '5px'}}>{promoCodeError}</div>}
                    {(isPromocodeValid === null || isPromocodeValid === true ) ? <></> : <div className="error-warning">{promoCodeNotification} </div>}
                </section>

                <section className='form-input-list'>
                    <h3 className='registrations-headers'>BILLING INFORMATION</h3>
                    <div className='form-single-field'>
                        <label htmlFor="useParticipantInfo">Use First Participants Information?</label>
                        <input name='useParticipantInfo' type="checkbox" onClick={toggleUseParticipantInfo}/>
                    </div>
                    <label htmlFor="billingFirstName">
                        <p>First Name*</p>
                        <input
                            type="text"
                            name="billingFirstName"
                            required={true}
                            onChange={handleChangeRegistration}
                            value={useParticipantInfo ? participant.firstName : billingFirstName}
                        />
                    </label>
                    <label htmlFor="billingLastName">
                        <p>Last Name*</p>
                        <input
                            type="text"
                            name="billingLastName"
                            required={true}
                            onChange={handleChangeRegistration}
                            defaultValue={useParticipantInfo ? participant.lastName : billingLastName}
                        />
                    </label>
                    <label htmlFor="billingEmail">
                        <p>Work Email*</p>
                        <input
                            type="email"
                            name="billingEmail"
                            required={true}
                            onChange={handleChangeRegistration}
                            defaultValue={useParticipantInfo ? participant.email : billingEmail}
                        />
                    </label>
                    <label htmlFor="billingCompany">
                        <p>Company*</p>
                        <input
                            type="text"
                            name="billingCompany"
                            required={true}
                            onChange={handleChangeRegistration}
                            defaultValue={useParticipantInfo ? participant.company : billingCompany}
                        />
                    </label>
                    <label htmlFor="billingTitle">
                        <p>Title*</p>
                        <input
                            type="text"
                            name="billingTitle"
                            required={true}
                            onChange={handleChangeRegistration}
                            defaultValue={useParticipantInfo ? participant.title : billingTitle}
                        />
                    </label>
                    <label htmlFor="billingPhone">
                        <p>Phone*</p>
                        <input
                            type="tel"
                            name="billingPhone"
                            pattern='[0-9-_.]{1,30}'
                            required={true}
                            onChange={handleChangeRegistration}
                            defaultValue={useParticipantInfo ? participant.phone : billingPhone}
                        />
                    </label>
                </section>

                <section className='form-input-list'>
                    <h3 className='registrations-headers'>BILLING ADDRESS</h3>
                    <label htmlFor="billingStreetOne">
                        <p>Street 1/PO Box*</p>
                        <input
                            type="text"
                            name="billingStreetOne"
                            required={true}
                            onChange={handleChangeRegistration}
                            defaultValue={billingStreetOne}
                        />
                    </label>
                    <label htmlFor="billingStreetTwo">
                        <p>Street 2</p>	
                        <input
                            type="text"
                            name="billingStreetTwo"
                            onChange={handleChangeRegistration}
                            defaultValue={billingStreetTwo}
                        />
                    </label>
                    <label htmlFor="billingCity">
                        <p>City*</p>
                        <input
                            type="text"
                            name="billingCity"
                            required={true}
                            onChange={handleChangeRegistration}
                            defaultValue={billingCity}
                        />
                    </label>
                    <label htmlFor="billingState">
                        <p>State*</p>
                        <RegionDropdown 
                            defaultOptionLabel="Select State"
                            country={billingCountry}
                            value={billingState}
                            required={true}
                            onChange={(val) => handleSelectState(val)}
                        />
                    </label>
                    <label htmlFor="billingCountry">
                        <p>Country*</p>
                        <CountryDropdown 
                            value={billingCountry}
                            priorityOptions={['US']}
                            required={true}
                            onChange={(val) => handleSelectCountry(val)}
                        />
                    </label>
                    <label htmlFor="billingZipCode">
                        <p>Zip*</p>
                        <input
                            type="text"
                            name="billingZipCode"
                            required={true}
                            onChange={handleChangeRegistration}
                            defaultValue={billingZipCode}
                        />
                    </label>
                </section>
                <nav>
                    <button onClick={handleBackStep} className='salmon-button-small'>BACK</button>
                    <button type="submit" className='salmon-button-small'>FORWARD</button>
                </nav>
            </form>
        </section>
    )
}
