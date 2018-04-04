const express = require('express')
const router = express.Router()
const getCardPerIDController = rootRequire('server/controllers/index').getCardPerID

router.get('/:id', getCardPerIDController)

module.exports = router