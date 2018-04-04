const config = require('config')
const { Client } = require('pg')

const checkIfUserExist = (client, username) => new Promise((resolve, reject) => {
  console.log('entered checkIfUserExist')
  if (username) {
    client.query(`SELECT * FROM ${config.get('DB.PGTABLELOGIN.NAME')} WHERE ${config.get('DB.PGTABLELOGIN.COLUMN1')} = '${username}'`)
    .then((res) => {
        return resolve(res.rows[0])
    })
    .catch((err) => {
      console.log('catching error query')
      return reject(`checkIfUserExist: ${err}`)
    })
  } else {
    return reject('Account does not exist')
  }
})

const checkCredentials = (username, mail, password, userInfo) => new Promise((resolve, reject) => {
  console.log('entered checkCredentials')
  if (username === userInfo.username) {
    if (password === userInfo.password) {
      let jsonAnswer = {
          "userID" : userInfo.user_id
      }
      return resolve(JSON.stringify(jsonAnswer))
    } else {
      return reject(`Wrong Password. Please try again`)
    }
  } else {
    return reject(`Username Unknown. Please try again`)
  }
})

module.exports = {
  /**
  * @description Query the database to check if a user already exists
  * @param {String} username
  * @param {String} mail
  * @param {String} password
  * @return {String} Confirmation message with user_id if it is the case, error if not
  */
  login(req, res) {
    return new Promise((resolve, reject) => {
      const client = new Client({
        user: config.get('DB.PGUSER'),
        host: config.get('DB.PGHOST'),
        database: config.get('DB.PGDATABASE'),
        password: config.get('DB.PGPASSWORD'),
        port: config.get('DB.PGPORT')
      })
      console.log(`Login Request received`)
      let username = req.params.username
      let mail = req.params.mail
      let password = req.params.password
      client.connect((errorDB) => {
        console.log('entered connect')
        if (errorDB) {
          console.log('error db')
          client.end()
          res.status(400).send(`DB: ${errorDB}`)
        } else {
          checkIfUserExist(client, username)
          .then((row) => {
            checkCredentials(username, mail, password, row)
            .then((jsonObject) => {
              client.end()
              res.set('Content-Type','application/json')
              res.status(200).send(jsonObject)
              return resolve()
            })
            .catch((errCred) => {
              client.end()
              res.status(400).send(errCred)
              return reject(errCred)
            })
          })
          .catch((errUserExist) => {
            client.end()
            res.status(400).send(errUserExist)
            return reject(errUserExist)
          })
        }
      })
    })
  }
}


        