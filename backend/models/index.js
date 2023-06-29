const config = require('../config/config.js')
const { Sequelize } = require('sequelize')

let sequelize = new Sequelize(
	config.DB,
	config.USER,
	config.PASSWORD,
	{
		host: config.HOST,
		dialect: config.dialect,
		logging: false,
		// idle_timeout: 7200
		ssl: true,
		pool: {
			max: config.pool.max,
			min: config.pool.min,
			acquire: config.pool.acquire,
			idle: config.pool.idle,
		},
	}
)

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.event = require('./event.model.js')(sequelize, Sequelize)

module.exports = db
