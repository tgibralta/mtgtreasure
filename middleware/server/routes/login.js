const express = require('express')
const router = express.Router()
const loginController = rootRequire('server/controllers/index').login

router.get('/:username/:password', loginController)

module.exports = router