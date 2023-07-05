const controller = require('../controllers/register.controller')

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept'
		)
		next()
	})

	app.get('/promocode/:name/:campaign', controller.getPromoCode)
	app.put('/promocode/:id', controller.updatePromoCode)
	app.post('/charge', controller.chargeStripe)
}
