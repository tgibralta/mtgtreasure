const express = require('express')
const router = express.Router()
const deleteUserController = rootRequire('server/controllers/index').deleteUser

router.put('/', deleteUserController)

module.exports = router