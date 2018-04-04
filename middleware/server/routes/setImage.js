const express = require('express')
const router = express.Router()
const setImageController = rootRequire('server/controllers/index').setImage

router.put('/', setImageController)

module.exports = router