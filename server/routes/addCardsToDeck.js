const express = require('express')
const router = express.Router()
const addCardsToDeckController = rootRequire('server/controllers/index').addCardsToDeck

router.post('/', addCardsToDeckController)

module.exports = router