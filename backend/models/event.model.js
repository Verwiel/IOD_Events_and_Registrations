module.exports = (sequelize, Sequelize) => {
	const Event = sequelize.define('events', {
		Id: {
			type: Sequelize.STRING,
			primaryKey: true,
			required: true,
			allowNull: false,
		},
		Name: {
			type: Sequelize.STRING,
			required: true,
			allowNull: false,
		},
		ParentId: {
			type: Sequelize.STRING,
			required: true,
			allowNull: true,
		},
		Type: {
			type: Sequelize.STRING,
			required: true,
			allowNull: true,
		},
		IsActive: {
			type: Sequelize.BOOLEAN,
		},
		Is_Workshop_Full__c: {
			type: Sequelize.BOOLEAN,
		},
		Is_T3_Full__c: {
			type: Sequelize.BOOLEAN,
		},
		Campaign_Class__c: {
			type: Sequelize.STRING,
		},
		Delivery_Format__c: {
			type: Sequelize.STRING,
		},
		Venue__c: {
			type: Sequelize.STRING,
		},
		Street_Address__c: {
			type: Sequelize.STRING,
		},
		State__c: {
			type: Sequelize.STRING,
		},
		Zip_Code__c: {
			type: Sequelize.STRING,
		},
		Event_Country__c: {
			type: Sequelize.STRING,
		},
		Time_Zone__c: {
			type: Sequelize.STRING,
		},
		City__c: {
			type: Sequelize.STRING,
		},
		Metro_Area__c: {
			type: Sequelize.STRING,
		},
		Time_Zone__c: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		LastModifiedDate: {
			type: Sequelize.DATEONLY,
		},
		Region__c: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		Classroom_Link_1_Day__c: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		Classroom_Link_T3__c: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		Trigger_Overflow__c: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
		},
		// Stored as string to keep the date formatting consistent (+0000 != Z)
		X1_Day_Start_DateTime__c: {
			type: Sequelize.STRING,
		},
		X1_Day_End_Date_Time__c: {
			type: Sequelize.STRING,
		},
		X2_Day_Start_date_time__c: {
			type: Sequelize.STRING,
		},
		X2_Day_End_date_time__c: {
			type: Sequelize.STRING,
		},
		X3_Day_Start_date_time__c: {
			type: Sequelize.STRING,
		},
		X3_Day_End_date_time__c: {
			type: Sequelize.STRING,
		},
        createdAt: {
			type: Sequelize.DATE,
		},
		updatedAt: {
			type: Sequelize.DATE,
		},
	})
	return Event
}
