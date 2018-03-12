const express = require('express')
const router = express.Router()
const loginController = rootRequire('server/controllers/index').login

router.put('/', loginController)

module.exports = router