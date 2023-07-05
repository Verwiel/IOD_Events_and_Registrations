module.exports = (sequelize, Sequelize) => {
	const PromoCode = sequelize.define('promocodes', {
		id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            required: true,
            allowNull: false
        },
        value: {
            type: Sequelize.INTEGER,
            required: true,
            allowNull: false
        },
        timesUsed: {
            type: Sequelize.INTEGER(11),
        },
        maxUsage: {
            type: Sequelize.INTEGER,
        },
        validFor: {
            type: Sequelize.STRING,
        },
        createdBy: {
            type: Sequelize.UUID
        },
        createdAt: {
            type: Sequelize.DATE
        },
        updatedAt: {
            type: Sequelize.DATE
        }
	})
	return PromoCode
}
