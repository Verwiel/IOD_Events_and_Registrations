import { useRegistration } from "../../context/RegistrationProvider"

export const EventParticipantForm = () => {
    const { participants, addParticipant, handleChangeParticipant } = useRegistration()
    const isRequired =  participants.length === 0 ? true : false

    return (
        <section className='form-input-list'>
            <h3 className='registrations-headers'>Participant Information</h3>
            <label htmlFor="firstName" className='text-body'>
                <p>First Name</p>
                <input 
                    type='text'
                    name="firstName"
                    required= {isRequired}
                    onChange={handleChangeParticipant}
                    value={addParticipant.firstName}
                />
            </label> 
            <label htmlFor="lastName" className='text-body'>
                <p>Last Name</p>
                <input
                    type='text'
                    name="lastName"
                    required= {isRequired}
                    onChange={handleChangeParticipant}
                    value={addParticipant.lastName}
                />
            </label> 
            <label htmlFor="email" className='text-body'>
                <p>Email</p>
                <input
                    type='email'
                    name="email"
                    required= {isRequired}
                    onChange={handleChangeParticipant}
                    value={addParticipant.email}
                />
            </label>
            <label htmlFor="company" className='text-body'>
                <p>Company</p>
                <input 
                    type='text'
                    name="company"
                    required= {isRequired}
                    onChange={handleChangeParticipant}
                    value={addParticipant.company}
                />
            </label>
            <label htmlFor="title" className='text-body'>
                <p>Title</p>
                <input
                    type='text'
                    name="title"
                    required= {isRequired}
                    onChange={handleChangeParticipant}
                    value={addParticipant.title}
                />
            </label>
            <label htmlFor="phone" className='text-body'>
                <p>Phone Number</p>
                <input
                    type='tel'
                    name="phone"
                    pattern='[0-9-_.+]{1,30}'
                    required= {isRequired}
                    onChange={handleChangeParticipant}
                    value={addParticipant.phone}
                /> 
            </label>
        </section>
    )
}
