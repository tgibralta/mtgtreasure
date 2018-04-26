const express = require('express')
const router = express.Router()
const getUserHistoryController = rootRequire('server/controllers/index').getUserHistory

router.get('/:userid', getUserHistoryController)

module.exports = router