const db = require('../models')
const isEmpty = require('../helper/isEmpty')
const PromoCode = db.promocode
const Sequelize = require('sequelize')
const op = Sequelize.Op

exports.getPromoCode = async (req, res) => {
    try {
        let response = await PromoCode.findOne({
            where: { 
                name: req.params.name,
                validFor: req.params.campaign,
                timesUsed: {
                    [op.lt]: Sequelize.col('maxUsage')
                }
            }
        })

        if (isEmpty(response)) {
            res.status(400).send({message: "Promo code is not valid."})
        } else {
            response.dataValues.value = parseInt(response.dataValues.value)
            response.dataValues.timesUsed = parseInt(response.dataValues.timesUsed)
            res.status(200).send(response)
        }
    } catch (error) {
        res.status(500).send({ message: "Something broke while finding that promo code." })
    }
}

exports.updatePromoCode = async (req, res) => {
    req.body.timesUsed = req.body.timesUsed.toString()
    req.body.value = req.body.value?.toString()

    try {
        let response = await PromoCode.update(req.body, {
            where: { id: req.params.id }
        })

        if(response[0] === 0){
            res.status(500).send({ message: 'Promo code was unable to be updated' })
        }

        res.status(200).send({ message: 'Promo code was successfully updated!'})
    } catch (error) {
        res.status(500).send(err)
    }
}
