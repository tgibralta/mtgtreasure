const express = require('express')
const router = express.Router()
const addCardToCollectionController = rootRequire('server/controllers/index').addCardToCollection

router.post('/', addCardToCollectionController)

module.exports = router