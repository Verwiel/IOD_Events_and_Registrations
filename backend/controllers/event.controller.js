const db = require('../models')
const SalesforceFunctionAggregator = require('../salesforce/aggregator')
const isEmpty = require('../helper/isEmpty')
const Events = db.event
const Sequelize = require('sequelize')
const op = Sequelize.Op


exports.resync = async (req, res) => {
	try {
		await SalesforceFunctionAggregator.getAuthTokenAndPublicPrograms()
		res.send({ msg: 'resync public programs ran' })
	} catch (err) {
		res.status(500).send({ message: err.message })
	}
}

exports.check = async (req, res) => {
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
		res.status(500).send({ msg: "Something broke while getting public programs." })
	}
}

exports.getOneEvent = async (req, res) => {
	try {
		let response = await Events.findAll({
            where: { id: req.params.id }
        })

        if (isEmpty(response)) {
            return res.status(400).send({msg: "There are no events."})
        } else {
            return res.status(200).send(response)
        }
	} catch (err) {
		res.status(500).send({ msg: "Something broke while getting the event." })
	}
}

exports.addEvents = async (req, res) => {
    try {
        let newEvent = req.body
        let response = await Events.create(newEvent)
        res.status(201).send(response)

	} catch (err) {
		res.status(500).send({ msg: "Something broke while saving the event." })
	}
}

exports.updateEvent = async (req, res) => {
    try {
        let response = await Events.update(req.body, {
            where: { id: req.params.id }
        })
        if(response[0] === 0){
            res.status(500).send({ msg: 'Event was unable to be updated.' })
        }
        res.status(200).send({ msg: 'Event was successfully updated!'})

	} catch (err) {
		res.status(500).send({ msg: "Something broke while updating the event." })
	}
}

exports.deleteEvents = async (req, res) => {
    try {
        let response = await Events.destroy({
            where: { Id: req.body }
        })

        if(response === 0){
            res.status(500).send({ msg: 'Event was unable to be deleted.' })
        }
        res.status(200).send({ msg: "Event has successfully been deleted."})
        

	} catch (err) {
		res.status(500).send({ msg: "Something broke while deleting the event." })
	}
}
