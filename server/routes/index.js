const getCardPerNameRoute = rootRequire('server/routes/getCardPerName')
const setImageRoute = rootRequire('server/routes/setImage')
const getCardPerIDRoute = rootRequire('server/routes/getCardPerID')
const loginRoute = rootRequire('server/routes/login')

module.exports = (app) => {
  app.use('/', (req, res, next) => {
      next()
  })
  app.use('/login', loginRoute)
  app.use('/getcard/name', getCardPerNameRoute)
  app.use('/getcard/id', getCardPerIDRoute)
  app.use('/getimage', setImageRoute)
  
}