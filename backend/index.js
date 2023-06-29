const express = require('express')
const path = require('path')
const cors = require('cors')
const app = express()
require('dotenv').config()
// const cron = require('node-cron')
// const SalesforceFunctionAggregator = require('./salesforce/aggregator')

const corsOptions = { origin: 'http://localhost:8081' }
app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')))

const db = require('./models')
db.sequelize
	.sync()
	.then(() => {
		console.log('Synced db.')
	})
	.catch((err) => {
		console.log('Failed to sync db: ' + err.message)
	})

// routes
require('./routes/event.routes')(app)
require('./routes/register.routes')(app)

// cron.schedule('* * * * *', function(){
//     SalesforceFunctionAggregator.getAuthTokenAndPublicPrograms()
// }, { scheduled: true, timezone: "America/Denver" })

// set port, listen for requests
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`)
})
