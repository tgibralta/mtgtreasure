const path = require('path')
const bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const schedule = require('node-schedule')
const fetchPrice = require('./server/jobs/fetchPrices')


global.rootRequire = (name) => {
    return require(path.join(__dirname, name))
}

// PORT DEFINITION
const port = process.env.PORT || 8080
const hostname = process.env.HOSTNAME

// APP SETUP
const app = express()
app.use(cors())

// BODY PARSER
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES
require.main.require('./server/routes')(app)




// #################################################################### START THE SERVER
app.listen(port, function (err) {
    if (err) {
        console.log(`Error while opening application: ${err}`)
    } else {
        console.log(`Starting application on port ${port}`)
    }
})