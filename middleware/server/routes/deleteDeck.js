const express = require('express')
const router = express.Router()
const deleteDeckController = rootRequire('server/controllers/index').deleteDeck

router.put('/', deleteDeckController)

module.exports = router