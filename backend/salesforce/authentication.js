const axios = require('axios')
const { salesforceGrantType, salesforceClientId, salesforceClientSecret, salesforceUserName, salesforcePassword, salesforceSecurityToken } = require('../config/config')

const salesforceBaseURL = 'https://login.salesforce.com/services/oauth2/token'
const data = {
    'grant_type' : salesforceGrantType,
    'client_id' : salesforceClientId,
    'client_secret' : salesforceClientSecret,
    'username' : salesforceUserName,
    'password' : salesforcePassword+salesforceSecurityToken
}

const SalesforceAuthentication = {

    getQueryString(data = {}){
        return Object.entries(data)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&')
    },

    getSalesforceAccessToken(){
        return axios.post(`${salesforceBaseURL}`,data, {
            headers : {
                "Content-Type" : "application/x-www-form-urlencoded"
            },
            withCredentials: true,
            transformRequest: this.getQueryString
        })
        .then(res => {
            return res.data.access_token
        })
        .catch(err => {
            return err
        })
    },
}

module.exports = SalesforceAuthentication
