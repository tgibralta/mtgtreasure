const getCardPerNameRoute = rootRequire('server/routes/getCardPerName')
const setImageRoute = rootRequire('server/routes/setImage')
const getCardPerIDRoute = rootRequire('server/routes/getCardPerID')
const addUserRoute = rootRequire('server/routes/addUser')
const loginRoute = rootRequire('server/routes/login')
const deleteUserRoute = rootRequire('server/routes/deleteUser')
const addCardToCollectionRoute = rootRequire('server/routes/addCardToCollection')

module.exports = (app) => {
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
}