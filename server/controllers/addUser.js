const config = require('config')
const { Client } = require('pg')

const checkIfUserExist = (client, username) => new Promise((resolve, reject) => {
  if (username) {
    client.query(`SELECT * FROM ${config.get('DB.PGTABLELOGIN.NAME')} WHERE ${config.get('DB.PGTABLELOGIN.COLUMN1')} = '${username}'`)
    .then((res) => {
      if (res.rows[0]) {
        return reject (`User already exists`)
      } else {
        return resolve()
      }
    })
    .catch((err) => {
      return reject(err)
    })
  } else {
    return reject('Invalid username')
  }
})

const checkIfMailExist = (client, mail) => new Promise((resolve, reject) => {
  if (mail) {
    client.query(`SELECT * FROM ${config.get('DB.PGTABLELOGIN.NAME')} WHERE ${config.get('DB.PGTABLELOGIN.COLUMN2')} = '${mail}'`)
    .then((res) => {
      if (res.rows[0]) {
        return reject (`Mail already used`)
      } else {
        return resolve()
      }
    })
    .catch((err) => {
      return reject(err)
    })
  } else {
    return reject('Invalid Mail')
  }
})

// TODO: CHANGE THE DEFAULT BEHAVIOR OF IS_DISABLED AND SCOPE
const queryDB = (client, username, mail, password) => new Promise((resolve, reject) => {
  client.query(`INSERT INTO ${config.get('DB.PGTABLELOGIN.NAME')} (${config.get('DB.PGTABLELOGIN.COLUMN1')},${config.get('DB.PGTABLELOGIN.COLUMN2')},${config.get('DB.PGTABLELOGIN.COLUMN3')},${config.get('DB.PGTABLELOGIN.COLUMN4')},${config.get('DB.PGTABLELOGIN.COLUMN5')}) VALUES ('${username}', '${mail}', '${password}', false, 'user')`)
  .then(() => {
    return resolve(`Account created`)
  })
  .catch((err) => {
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
      const client3 = new Client({
        user: config.get('DB.PGUSER'),
        host: config.get('DB.PGHOST'),
        database: config.get('DB.PGDATABASE'),
        password: config.get('DB.PGPASSWORD'),
        port: config.get('DB.PGPORT')
      })
      client1.connect((errorDB) => {
        if (errorDB) {
          client1.end()
          return reject(`DB: ${errorDB}`)
        } else {
          checkIfUserExist(client1, req.body.username)
          .then(()=> {
            client1.end()
            client2.connect((errorDB2) => {
              if (errorDB2) {
                client2.end()
                return reject(`DB: ${errorDB2}`)
              } else {
                checkIfMailExist(client2, req.body.mail)
                .then(() => {
                  client2.end()
                  client3.connect((errorDB3) => {
                    if (errorDB3) {
                      client3.end()
                      return reject(`DB: ${errorDB3}`)
                    } else {
                      queryDB(client3, req.body.username, req.body.mail, req.body.password)
                      .then((msg) => {
                        res.status(200).send(msg)
                        client3.end()
                      })
                      .catch((err) => {
                        res.status(400).send(err)
                        client3.end()
                      })
                    }
                  })
                })
                .catch((err) => {
                  res.status(400).send(err)
                  client2.end()
                })
              }
            })
          })
          .catch((err) => {
            res.status(400).send(err)
            client.end()
          })
        }
      })
      
    })
  }
}

