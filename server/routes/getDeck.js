const express = require('express')
const router = express.Router()
const getDeckController = rootRequire('server/controllers/index').getDeck

router.get('/:deckid', getDeckController)

module.exports = router