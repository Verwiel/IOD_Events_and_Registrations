const controller = require('../controllers/event.controller')

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			'Access-Control-Allow-Headers',
			'x-access-token, Origin, Content-Type, Accept'
		)
		next()
	})

	app.get("/events/resync", controller.resync)
	app.get("/events/upcoming", controller.getUpcomingPublicEvents)
	app.get("/events/upcoming-with-children", controller.getUpcomingPublicEventsAndChildren)
	app.get("/events/:id", controller.getOneEvent)
	app.get("/events/with-children/:id", controller.getEventAndChildren)
	app.put("/events/:id", controller.updateEvent)
	app.post("/events/", controller.addEvents)
	app.post("/events/bulk-delete/", controller.deleteEvents)
}
