const config = require('config')
client = rootRequire('server/init/database').client

const checkIfUserExist = (username) => new Promise((resolve, reject) => {
  if (username) {
    client.query(`SELECT 1 FROM ${config.get('DB.PGTABLELOGIN.NAME')} WHERE ${config.get('DB.PGTABLELOGIN.COLUMN1')} = ${username}`)
    .then(() => {
      return reject (`User already exists`)
    })
    .catch(() => {
      return resolve()
    })
  } else {
    return reject('Invalid username')
  }
})

const checkIfMailExist = (mail) => new Promise((resolve, reject) => {
  if (mail) {
    client.query(`SELECT 1 FROM ${config.get('DB.PGTABLELOGIN.NAME')} WHERE ${config.get('DB.PGTABLELOGIN.COLUMN2')} = ${mail}`)
    .then(() => {
      return reject (`Mail already exists`)
    })
    .catch(() => {
      return resolve()
    })
  } else {
    return reject('Invalid Mail')
  }
})

// TODO: CHANGE THE DEFAULT BEHAVIOR OF IS_DISABLED AND SCOPE
const addUserToDB = (username, mail, password) => new Promise((resolve, reject) => {
  console.log(`INSERT INTO ${config.get('DB.PGTABLELOGIN.NAME')} (${config.get('DB.PGTABLELOGIN.COLUMN1')},${config.get('DB.PGTABLELOGIN.COLUMN2')},${config.get('DB.PGTABLELOGIN.COLUMN3')},${config.get('DB.PGTABLELOGIN.COLUMN4')},${config.get('DB.PGTABLELOGIN.COLUMN5')}) VALUES ('${username}', '${mail}', '${password}', false, 'user')`)
  client.query(`INSERT INTO ${config.get('DB.PGTABLELOGIN.NAME')} (${config.get('DB.PGTABLELOGIN.COLUMN1')},${config.get('DB.PGTABLELOGIN.COLUMN2')},${config.get('DB.PGTABLELOGIN.COLUMN3')},${config.get('DB.PGTABLELOGIN.COLUMN4')},${config.get('DB.PGTABLELOGIN.COLUMN5')}) VALUES ('${username}', '${mail}', '${password}', false, 'user')`)
  .then(() => {
    return resolve(`Account created`)
  })
  .catch((err) => {
    console.log(`addUserToDB: ${err}`)
    return reject(err)
  })
})

module.exports = {
   /**
 * @description Querys the database to check if a user already exists. If not, add it to the database
 * @param {String} username
 * @param {String} mail
 * @param {String} password
 * @return {String} Confirmation message
 */
  addUser(req, res) {
    return new Promise((resolve, reject) => {
      client.connect((errorDB) => {
        if (errorDB) {
          return reject(`DB: ${errorDB}`)
        } else {
          checkIfUserExist(req.body.username)
          .then(()=> {
            checkIfMailExist(req.body.mail)
            .then(() => {
              addUserToDB(req.body.username, req.body.mail, req.body.password)
              .then((msg) => {
                res.status(200).send(msg)
              })
              .catch((err) => {
                res.status(400).send(err)
              })
            })
            .catch((err) => {
              res.status(400).send(err)
            })
          })
          .catch((err) => {
            res.status(400).send(err)
          })
        }
      })
      
    })
  }
}

