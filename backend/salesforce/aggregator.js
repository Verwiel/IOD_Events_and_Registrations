const SalesforceAuthentication = require('./authentication')
const SalesforceEventsAPI = require('./events-api')


const SalesforceFunctionAggregator = {

    async getAuthTokenAndPublicPrograms(){
        let salesforceToken = await SalesforceAuthentication.getSalesforceAccessToken()
        await SalesforceEventsAPI.getUpcomingPublicPrograms(salesforceToken)
    },
}

module.exports = SalesforceFunctionAggregator
