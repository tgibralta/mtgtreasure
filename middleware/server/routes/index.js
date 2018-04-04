const getCardPerNameRoute = rootRequire('server/routes/getCardPerName')
const setImageRoute = rootRequire('server/routes/setImage')
const getCardPerIDRoute = rootRequire('server/routes/getCardPerID')
const addUserRoute = rootRequire('server/routes/addUser')
const loginRoute = rootRequire('server/routes/login')
const deleteUserRoute = rootRequire('server/routes/deleteUser')
const addCardToCollectionRoute = rootRequire('server/routes/addCardToCollection')
const removeCardFromCollectionRoute = rootRequire('server/routes/removeCardFromCollection')
const getCollectionRoute = rootRequire('server/routes/getCollection')
const addCardsToDeckRoute = rootRequire('server/routes/addCardsToDeck')
const getDeckRoute = rootRequire('server/routes/getDeck')
const deleteDeckRoute = rootRequire('server/routes/deleteDeck')
const cors = require('cors')

module.exports = (app) => {

  app.options('*', cors())

  app.use('/', (req, res, next) => {
      next()
  })
  app.use('/adduser', addUserRoute)
  app.use('/deleteuser', deleteUserRoute)
  app.use('/getcard/name', getCardPerNameRoute)
  app.use('/getcard/id', getCardPerIDRoute)
  app.use('/getimage', setImageRoute)
  app.use('/login', loginRoute)
  app.use('/addcardtocollection', addCardToCollectionRoute)
  app.use('/removecardfromcollection', removeCardFromCollectionRoute)
  app.use('/getcollection', getCollectionRoute)
  app.use('/addcardstodeck', addCardsToDeckRoute)
  app.use('/getdeck', getDeckRoute)
  app.use('/deletedeck', deleteDeckRoute)
}