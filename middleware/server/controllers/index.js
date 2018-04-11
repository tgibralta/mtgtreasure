const getCardPerName = rootRequire('server/controllers/getCardPerName').getCardPerName
const setImage = rootRequire('server/controllers/setImage').setImage
const getCardPerID = rootRequire('server/controllers/getCardPerID').getCardPerID
const addUser = rootRequire('server/controllers/addUser').addUser
const deleteUser = rootRequire('server/controllers/deleteUser').deleteUser
const login = rootRequire('server/controllers/login').login
const addCardToCollection = rootRequire('server/controllers/addCardToCollection').addCardToCollection
const removeCardFromCollection = rootRequire('server/controllers/removeCardFromCollection').removeCardFromCollection
const getCollection = rootRequire('server/controllers/getCollection').getCollection
const addCardsToDeck = rootRequire('server/controllers/addCardsToDeck').addCardsToDeck
const getDeck = rootRequire('server/controllers/getDeck').getDeck
const getDecks = rootRequire('server/controllers/getDecks').getDecks
const deleteDeck = rootRequire('server/controllers/deleteDeck').deleteDeck

module.exports = {
    getCardPerName,
    getCardPerID,
    setImage,
    addUser,
    login,
    deleteUser,
    addCardToCollection,
    removeCardFromCollection,
    getCollection,
    addCardsToDeck,
    getDeck,
    getDecks,
    deleteDeck
}