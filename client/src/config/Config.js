module.exports = {
    iodFrontEndUrl : process.env.REACT_APP_FRONTEND_URL,
    stripeAPIKey : process.env.REACT_APP_STRIPE_TEST_API_KEY,
    workshopPrice : parseInt(process.env.REACT_APP_WORKSHOP_PRICE),
    certPrice : parseInt(process.env.REACT_APP_CERTIFICATION_PRICE),
    fullEventPrice : parseInt(process.env.REACT_APP_FULL_EVENT_PRICE),
    breakthroughsPrice : parseInt(process.env.REACT_APP_BREAKTHROUGHS_PRICE),
}
