const express = require('express')
const router = express.Router()
const getDecksController = rootRequire('server/controllers/index').getDecks

router.get('/:userid', getDecksController)

module.exports = router