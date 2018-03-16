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

const makeChecksOnAllField = (username, mail, password, userInfo) => new Promise((resolve, reject) => {
    if (username === userInfo.username && mail === userInfo.mail && password === userInfo.password) {
      return resolve()
    } else {
      return reject('Authentication failed')
    }
})

// TODO: ALSO ADD THE QUERIES TO DELETE EVERYTHING FROM THE OTHER TABLES
const makeDeleteQuery = (client, username) => new Promise((resolve, reject) => {
    client.query(`DELETE FROM ${config.get('DB.PGTABLELOGIN.NAME')} WHERE ${config.get('DB.PGTABLELOGIN.COLUMN1')} = '${username}'`)
    .then(() => {
      return resolve(`Account deleted`)
    })
    .catch((err) => {
      return reject(err)
    })
})

module.exports = {
    deleteUser(req, res) {
      return new Promise((resolve, reject) => {
        const client1 = new Client({
          user: config.get('DB.PGUSER'),
          host: config.get('DB.PGHOST'),
          database: config.get('DB.PGDATABASE'),
          password: config.get('DB.PGPASSWORD'),
          port: config.get('DB.PGPORT')
        })
        const client2 = new Client({
          user: config.get('DB.PGUSER'),
          host: config.get('DB.PGHOST'),
          database: config.get('DB.PGDATABASE'),
          password: config.get('DB.PGPASSWORD'),
          port: config.get('DB.PGPORT')
        })
        let username = req.body.username
        let mail = req.body.mail
        let password = req.body.password
        client1.connect((errorDB1) => {
          if (errorDB1) {
            res.status(400).send(errorDB1)
          } else {
            checkIfUserExist(client1, username)
            .then((infoDB) => {
              client1.end()
              makeChecksOnAllField(username, mail, password, infoDB)
              .then(() => {
                client2.connect((errorDB2) => {
                  if (errorDB2) {
                    res.status(400).send(errorDB2)
                  } else {
                    makeDeleteQuery(client2, username)
                    .then((msg) => {
                      client2.end()
                      res.status(200).send(msg)
                    })
                    .catch((errDel) => {
                      client2.end()
                      res.status(400).send(errDel)
                    })
                  }
                })
              })
              .catch((errAuth) => {
                res.status(400).send(errAuth)
              })
            })
            .catch((err) => {
              client1.end()
              res.status(400).send(err)
            })
          }
        })
      })
    }
}