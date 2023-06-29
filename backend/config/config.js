let iodBaseUrl;
let iodFrontEndUrl;
let stripeToken;
let port = process.env.PORT

if(process.env.CUSTOM_NODE_ENV === 'development'){
    iodBaseUrl = `http://localhost:${port}`
    iodFrontEndUrl = `http://localhost:3000`
    stripeToken = process.env.STRIPE_TEST_SECRET_KEY
} else if(process.env.CUSTOM_NODE_ENV === 'test'){
    iodBaseUrl = `https://dev.insideoutdev.com`
    iodFrontEndUrl = `https://dev.insideoutdev.com`
    stripeToken = process.env.STRIPE_TEST_SECRET_KEY
} else if(process.env.CUSTOM_NODE_ENV === 'production'){
    iodBaseUrl = `https://insideoutdev.com`
    iodFrontEndUrl = `https://insideoutdev.com`
    stripeToken = process.env.STRIPE_LIVE_SECRET_KEY
} 

module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT,
    DATABASE_URL: process.env.DB_URL,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    iodBaseUrl : iodBaseUrl,
    iodFrontEndUrl : iodFrontEndUrl,
    stripeToken : stripeToken,
    // Salesforce
    salesforceGrantType : process.env.SALESFORCE_GRANT_TYPE,
    salesforceClientId : process.env.SALESFORCE_CLIENT_ID,
    salesforceClientSecret : process.env.SALESFORCE_CLIENT_SECRET,
    salesforceUserName : process.env.SALESFORCE_USER_NAME,
    salesforcePassword : process.env.SALESFORCE_PASSWORD,
    salesforceToken : process.env.SALESFORCE_TOKEN,
    salesforceSecurityToken: process.env.SALESFORCE_SECURITY_TOKEN,
}
