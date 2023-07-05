const db = require('../models')
const SalesforceFunctionAggregator = require('../salesforce/aggregator')
const isEmpty = require('../helper/isEmpty')
const Events = db.event
const Sequelize = require('sequelize')
const op = Sequelize.Op

const addChildrenToParent = (parent, children) => {
    let workshop = [{IsActive: false}]
    let certification = [{IsActive: false}]
    let fullEvent = [{IsActive: false}]

    if(children.length > 0){
        workshop = children.filter(child => 
            child.Campaign_Class__c.includes('Coaching Registration') ||
            child.Campaign_Class__c.includes('IOC Registration')
        )
        certification = children.filter(child => 
            child.Campaign_Class__c.includes('Coaching T3 Registration') ||
            child.Campaign_Class__c.includes('IOCT3 Registration')
        )
        fullEvent = children.filter(child => child.Campaign_Class__c.includes(' and T3 Registration'))
    }

    parent.dataValues["workshop"] = workshop[0]
    parent.dataValues["certification"] = certification[0]
    parent.dataValues["fullEvent"] = fullEvent[0]

    return parent
}

exports.resync = async (req, res) => {
	try {
		await SalesforceFunctionAggregator.getAuthTokenAndPublicPrograms()
		res.send({ message: 'resync public programs ran' })
	} catch (err) {
		res.status(500).send({ message: err.message })
	}
}

exports.getUpcomingPublicEvents = async (req, res) => {
	try {
		let response = await Events.findAll({ 
            where: { 
                X1_Day_Start_DateTime__c: {[op.gte]: new Date().toISOString()}, 
                Type: 'Public Program'
            }, 
            order:[ ['X1_Day_Start_DateTime__c', 'ASC'] ]
        })

		res.status(200).send(response)
	} catch (err) {
		res.status(500).send({ message: "Something broke while getting public programs." })
	}
}

exports.getUpcomingPublicEventsAndChildren = async (req, res) => {
	try {
		let response = await Events.findAll({ 
            where: { 
                X1_Day_Start_DateTime__c: {[op.gte]: new Date().toISOString()}, 
                Type: 'Public Program'
            }, 
            order:[ ['X1_Day_Start_DateTime__c', 'ASC'] ]
        })

        let parents = response.filter(event => 
            (event.Campaign_Class__c.includes("Parent") || 
            event.Campaign_Class__c.includes("Breakthroughs")) &&
            event.IsActive
        )

        parents.forEach(parent => {
            let children = response.filter(event => !event.Campaign_Class__c.includes("Parent") && !event.Campaign_Class__c.includes("Breakthroughs") && event.ParentId === parent.Id)

            const parentWithChildren = addChildrenToParent(parent, children)
            parent = parentWithChildren
        })

		res.status(200).send(parents)
	} catch (err) {
		res.status(500).send({ message: "Something broke while getting public programs." })
	}
}

exports.getOneEvent = async (req, res) => {
	try {
		let response = await Events.findAll({
            where: { Id: req.params.id }
        })

        if (isEmpty(response)) {
            return res.status(400).send({message: "There are no events."})
        } else {
            return res.status(200).send(response[0])
        }
	} catch (err) {
		res.status(500).send({ message: "Something broke while getting the event." })
	}
}

// Gets event and all children associated with it
exports.getEventAndChildren = async (req, res) => {
    try {
        let response = await Events.findAll({
            where: { 
                [op.or]: [
                    { Id: req.params.id },
                    { ParentId: req.params.id }
                ]
            }
        })

        // Breakthroughs will never have children but we still need the it returned as the parent event
        let children = response.filter(event => !event.Campaign_Class__c.includes("Parent") && !event.Campaign_Class__c.includes("Breakthroughs"))
        let parent = response.filter(event => event.Campaign_Class__c.includes("Parent") || event.Campaign_Class__c.includes("Breakthroughs"))[0]

        const parentWithChildren = addChildrenToParent(parent, children)
        res.status(200).send(parentWithChildren)
    } catch (error) {
        res.status(500).send({ message: "Something broke while getting the event and children." })
    }
}

exports.addEvents = async (req, res) => {
    try {
        let newEvent = req.body
        let response = await Events.create(newEvent)
        res.status(201).send(response)

	} catch (err) {
		res.status(500).send({ message: "Something broke while saving the event." })
	}
}

exports.updateEvent = async (req, res) => {
    try {
        let response = await Events.update(req.body, {
            where: { Id: req.params.id }
        })
        if(response[0] === 0){
            res.status(500).send({ message: 'Event was unable to be updated.' })
        }
        res.status(200).send({ message: 'Event was successfully updated!'})

	} catch (err) {
		res.status(500).send({ message: "Something broke while updating the event." })
	}
}

exports.deleteEvents = async (req, res) => {
    try {
        let response = await Events.destroy({
            where: { Id: req.body }
        })

        if(response === 0){
            res.status(500).send({ message: 'Event was unable to be deleted.' })
        }
        res.status(200).send({ message: "Event has successfully been deleted."})
        

	} catch (err) {
		res.status(500).send({ message: "Something broke while deleting the event." })
	}
}
