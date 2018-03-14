const getCardPerNameRoute = rootRequire('server/routes/getCardPerName')
const setImageRoute = rootRequire('server/routes/setImage')
const getCardPerIDRoute = rootRequire('server/routes/getCardPerID')
const addUserRoute = rootRequire('server/routes/addUser')

module.exports = (app) => {
  app.use('/', (req, res, next) => {
      next()
  })
  app.use('/adduser', addUserRoute)
  app.use('/getcard/name', getCardPerNameRoute)
  app.use('/getcard/id', getCardPerIDRoute)
  app.use('/getimage', setImageRoute)
  
}