const express = require('express')
const router = express.Router()
const addUserController = rootRequire('server/controllers/index').addUser

router.post('/', addUserController)

module.exports = router