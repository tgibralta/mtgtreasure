const express = require('express')
const router = express.Router()
const getCardPerNameController = rootRequire('server/controllers/index').getCardPerName

router.get('/:cardname', getCardPerNameController)

module.exports = router