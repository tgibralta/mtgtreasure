const express = require('express')
const router = express.Router()
const getTop10Controller = rootRequire('server/controllers/index').getTop10

router.get('/', getTop10Controller)

module.exports = router