const express = require('express')
const router = express.Router()
const addUserHistoryController = rootRequire('server/controllers/index').addUserHistory

router.put('/', addUserHistoryController)

module.exports = router