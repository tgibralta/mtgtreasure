const express = require('express')
const router = express.Router()
const updateUserHistoryController = rootRequire('server/controllers/index').updateUserHistory

router.put('/', updateUserHistoryController)

module.exports = router