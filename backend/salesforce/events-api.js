const axios = require('axios')
const { iodBaseUrl } = require('../config/config')
const { compareTwoArraysOfObjects } = require('../helper/arrayFunctions')

const salesforceBaseURL = 'https://insideoutdev.my.salesforce.com/services/data/v37.0/query/?q=SELECT+'

const desiredSalesforceFields = 'Name,Id,ParentId,Type,IsActive,Is_Workshop_Full__c,Is_T3_Full__c,CreatedDate,Campaign_Class__c,Venue__c,Street_Address__c,City__c,Metro_Area__c,State__c,Event_Country__c,Zip_Code__c,Time_Zone__c,LastModifiedDate,Delivery_Format__c,Region__c,Trigger_Overflow__c,Classroom_Link_1_Day__c,Classroom_Link_T3__c,X1_Day_Start_DateTime__c,X1_Day_End_Date_Time__c,X2_Day_Start_date_time__c,X2_Day_End_date_time__c,X3_Day_Start_date_time__c,X3_Day_End_date_time__c'

// let today = new Date().toISOString().split('T')[0]
let today = new Date().toISOString()

const SalesforceMiddleware = {
	// GET all public programs, we dont need to specify type, no harm in checking all pages for updates.
	async fetchEventData(salesforceToken) {
		try {
			const sfRes = await axios.get(
				`${salesforceBaseURL}${desiredSalesforceFields}+FROM+Campaign+WHERE+type='Public+Program'+AND+X1_Day_Start_DateTime__c!=null+AND+X1_Day_Start_DateTime__c>=${today}`,
				{
					headers: { Authorization: `Bearer ${salesforceToken}` },
				}
			)
			const dbRes = await axios.get(`${iodBaseUrl}/events/salesforce-check/public-programs`)

			let sfData = []
			let dbData = []

			if (sfRes.data.records.length > 0) {
				sfData = sfRes.data.records.map(
					({
						attributes,
						CreatedDate,
						LastModifiedDate,
						...keepAttrs
					}) => keepAttrs
				)
			}
			if (dbRes.data.length > 0) {
				dbData = dbRes.data.map(
					({
						createdAt,
						updatedAt,
						CreatedDate,
						LastModifiedDate,
						...keepAttrs
					}) => keepAttrs
				)
			}
			return {
				salesforceEvents: sfData,
				databaseEvents: dbData,
			}
		} catch (error) {
			console.log(error)
		}
	},

	async getUpcomingPublicPrograms(salesforceToken) {
		const { salesforceEvents, databaseEvents } = await this.fetchEventData(salesforceToken)
		let nothingChanged = compareTwoArraysOfObjects(
			salesforceEvents,
			databaseEvents
		)
		if (nothingChanged) {
			console.log('Salesforce and database match, skipping sync.')
		} else {
			this.syncEventRecords(salesforceEvents, databaseEvents)
		}
	},

	async syncEventRecords(sfEvents, dbEvents) {
		const findDifferentElements = (mainArray, compareArray) => {
			function comparer(otherArray) {
				return function (current) {
					return (
						otherArray.filter(function (other) {
							return (
								other.Name == current.Name &&
								other.IsActive == current.IsActive &&
								other.Campaign_Class__c ==
									current.Campaign_Class__c &&
								other.Is_Workshop_Full__c ==
									current.Is_Workshop_Full__c &&
								other.Is_T3_Full__c == current.Is_T3_Full__c &&
								other.Venue__c == current.Venue__c &&
								other.Street_Address__c ==
									current.Street_Address__c &&
								other.City__c == current.City__c &&
								other.Metro_Area__c == current.Metro_Area__c &&
								other.State__c == current.State__c &&
								other.Event_Country__c ==
									current.Event_Country__c &&
								other.Zip_Code__c == current.Zip_Code__c &&
								other.EndDate == current.EndDate &&
								other.Time_Zone__c == current.Time_Zone__c &&
								other.Delivery_Format__c ==
									current.Delivery_Format__c &&
								other.Region__c == current.Region__c &&
								other.Trigger_Overflow__c ==
									current.Trigger_Overflow__c &&
								other.Classroom_Link_1_Day__c ==
									current.Classroom_Link_1_Day__c &&
								other.Classroom_Link_T3__c ==
									current.Classroom_Link_T3__c &&
								other.X1_Day_Start_DateTime__c ==
									current.X1_Day_Start_DateTime__c &&
								other.X1_Day_End_Date_Time__c ==
									current.X1_Day_End_Date_Time__c &&
								other.X2_Day_Start_date_time__c ==
									current.X2_Day_Start_date_time__c &&
								other.X2_Day_End_date_time__c ==
									current.X2_Day_End_date_time__c &&
								other.X3_Day_Start_date_time__c ==
									current.X3_Day_Start_date_time__c &&
								other.X3_Day_End_date_time__c ==
									current.X3_Day_End_date_time__c
							)
						}).length == 0
					)
				}
			}
			return mainArray.filter(comparer(compareArray))
		}

		const compareParentEvents = async (sfEvents, dbEvents) => {
			const sfEventIds = sfEvents
				.filter((event) => event.Campaign_Class__c.includes('Parent'))
				.map(({ Id }) => Id)
				.sort()
			const dbEventIds = dbEvents
				.filter((event) => event.Campaign_Class__c.includes('Parent'))
				.map(({ Id }) => Id)
				.sort()

			const getUniqueIds = (mainArray, compareArray) => {
				return mainArray.filter(function (obj) {
					return compareArray.indexOf(obj) === -1
				})
			}

			let uniqueInSF = await findDifferentElements(sfEvents, dbEvents)
			let uniqueIdsInDB = await getUniqueIds(dbEventIds, sfEventIds)

			// if there are events in the database that are not in salesforce, delete them
			if (uniqueIdsInDB.length > 0) {
				console.log(
					'Events exist in database that arent in salesforce. Deleting database events'
				)
				await deleteEvent(uniqueIdsInDB)
			}

			if (uniqueInSF.length > 0) {
				console.log(
					'Events have been updated in Salesforce, updating database'
				)
				for (const event of uniqueInSF) {
					await checkEvent(event)
				}
			}

			uniqueInSF = []
			uniqueIdsInDB = []
		}

		async function deleteEvent(eventIds) {
			try {
				await axios.post(`${iodBaseUrl}/events/bulk-delete/`, eventIds)
			} catch (error) {
				console.log(error)
			}
		}

		async function checkEvent(event) {
			try {
				const queryResponse = await axios
					.get(`${iodBaseUrl}/events/${event.Id}`)
					.then((res) => res) // queryResponse.status === 200
					.catch((err) => err) // queryResponse.response.status === 400

				if (queryResponse.status === 200) {
					await updateEvent(event)
				} else {
					await saveEvent(event)
				}
			} catch (error) {
				await resolveErrorHandler(event)
			}
		}

		async function saveEvent(event) {
			try {
				await axios.post(`${iodBaseUrl}/events/`, event)
			} catch (error) {
				console.log(error)
			}
		}

		async function updateEvent(event) {
			try {
				await axios.put(`${iodBaseUrl}/events/${event.Id}`, event)
			} catch (error) {
				console.log(error)
			}
		}

		function resolveErrorHandler(event) {
			return new Promise((resolve) =>
				setTimeout(() => {
					resolve(event)
				}, 10)
			)
		}

		compareParentEvents(sfEvents, dbEvents)
	},
}

module.exports = SalesforceMiddleware
