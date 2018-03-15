const getCardPerName = rootRequire('server/controllers/getCardPerName').getCardPerName
const setImage = rootRequire('server/controllers/setImage').setImage
const getCardPerID = rootRequire('server/controllers/getCardPerID').getCardPerID
const addUser = rootRequire('server/controllers/addUser').addUser
const login = rootRequire('server/controllers/login').login

module.exports = {
    getCardPerName,
    getCardPerID,
    setImage,
    addUser,
    login
}