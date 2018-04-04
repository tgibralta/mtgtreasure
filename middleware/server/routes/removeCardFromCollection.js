const express = require('express')
const router = express.Router()
const removeCardFromCollectionController = rootRequire('server/controllers/index').removeCardFromCollection

router.put('/', removeCardFromCollectionController)

module.exports = router