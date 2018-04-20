const config = require('config')
const { Client, Pool } = require('pg')

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
    return reject('checkIfUserExist: Invalid username')
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
    return resolve()
  })
  .catch((err) => {
    console.log(`queryDB : ${err}`)
    return reject(err)
  })
})

const getUserID = (client, username) => new Promise((resolve, reject) => {
  console.log(`QUERY: SELECT * FROM ${config.get('DB.PGTABLELOGIN.NAME')} WHERE ${config.get('DB.PGTABLELOGIN.COLUMN1')}='${username}'`)
  client.query(`SELECT * FROM ${config.get('DB.PGTABLELOGIN.NAME')} WHERE ${config.get('DB.PGTABLELOGIN.COLUMN1')}='${username}'`)
  .then((res) => {
    let jsonResponse = {
      "userID": res.rows[0].user_id
    }
    return resolve(JSON.stringify(jsonResponse))
  })
  .catch((err) => {
    console.log(`getUserID: ${err}`)
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
      const pool = new Pool({
        user: config.get('DB.PGUSER'),
        host: config.get('DB.PGHOST'),
        database: config.get('DB.PGDATABASE'),
        password: config.get('DB.PGPASSWORD'),
        port: config.get('DB.PGPORT')
      })
      pool.connect()
      .then((client) => {
        checkIfUserExist(client,req.body.username)
        .then(() => {
          checkIfMailExist(client, req.body.mail)
          .then(() => {
            queryDB(client, req.body.username, req.body.mail, req.body.password)
            .then(() => {
              getUserID(client, req.body.username)
              .then((jsonUserID) => {
                res.set('Content-Type','application/json')
                res.status(200).send(jsonUserID)
                client.release()
                return resolve()
              })
              .catch((errUserID) => {
                client.release()
                pool.end()
                res.status(400).send(errUserID)
                return reject(errUserID)
              })
            })
          })
          .catch((errMail) => {
            console.log(errMail)
            res.status(400).send(errMail)
            client.release()
            pool.end()
            return reject(errMail)
          })
        })
        .catch((errUserExist)=>{
          console.log(errUserExist)
          res.status(400).send(errUserExist)
          client.release()
          pool.end()
          return reject(errUserExist)
        })
      })
      .catch((errConnect) => {
        console.log(`Error while connection with DB: ${errConnect}`)
        res.status(400).send(errConnect)
        client.release()
        pool.end()
        return reject(errConnect)
      })
    })
  }
}

