const express = require('express')
const router = express.Router()
const getCollectionController = rootRequire('server/controllers/index').getCollection

router.get('/:userid', getCollectionController)

module.exports = router