const express = require('express')
const router = express.Router()
const getPriceHistoryController = rootRequire('server/controllers/index').getPriceHistory

router.get('/:cardid', getPriceHistoryController)

module.exports = router