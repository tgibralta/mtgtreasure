const schedule = require('node-schedule')
const config = require('config')
const rp = require('request-promise')
const urlSearch = require('./../models/apiDescription').urlGetCards
const { Client, Pool } = require('pg')

const queryToDB = (data, client) => new Promise((resolve, reject) => {
  let card_id = data.multiverse_ids[0] || 0
  let price = data.usd || 0
  let date = ''
  currentDate = new Date()
  date = currentDate.getUTCFullYear().toString() + '-' + currentDate.getUTCMonth().toString() + '-' + currentDate.getUTCDay().toString()
  client.query(`INSERT INTO ${config.get("DB.PGTABLEPRICETRACKED.NAME")} (${config.get("DB.PGTABLEPRICETRACKED.COLUMN0")}, ${config.get("DB.PGTABLEPRICETRACKED.COLUMN1")}, ${config.get("DB.PGTABLEPRICETRACKED.COLUMN2")}) 
                VALUES ('${card_id}', '${price}', '${date}')`)
  .then(() => {
    
    return resolve()
  })
  .catch((err) => {
    // client.release()
    return reject(err)
  })  
})

const requestToAPI = (options) => new Promise ((resolve, reject) => {
  
  let optionsQuery = options
  rp(optionsQuery)
  .then((res) => {
    const pool = new Pool({
      user: config.get('DB.PGUSER'),
      host: config.get('DB.PGHOST'),
      database: config.get('DB.PGDATABASE'),
      password: config.get('DB.PGPASSWORD'),
      port: config.get('DB.PGPORT')
    })
    pool.connect()
    .then((client) => {
      let response = JSON.parse(res)
      let has_more = response.has_more
      let next_page = response.next_page
      let data = response.data
      let queries = data.map(function(rowData) {return queryToDB(rowData, client)})
      let promiseQueries = Promise.all(queries)
      promiseQueries
      .then(() => {
        if (has_more) {
          optionsQuery = {
            uri: next_page,
            method: 'GET'
          }
          client.release()
          pool.end()
          console.log(next_page)
          requestToAPI(optionsQuery)
          .then(() => {
            return resolve()
          })
          .catch((errInception) => {
            return reject(errInception)
          })
        } else {
          pool.end()
          return resolve()
        }
      })
      .catch((errQueries) => {
        pool.end()
        return reject(errQueries)
      })
    })
    .catch((errPool) => {
      return reject(errPool)
    })
  })
  .catch((err) => {
    console.log(`FetchPrice Job failed: ${err}`)
  })
})

var rule = new schedule.RecurrenceRule()
rule.hour = config.get("SCHEDULE_FETCH_PRICE.H")
rule.minute = config.get("SCHEDULE_FETCH_PRICE.MIN")
// rule.second = new schedule.Range(0,59,30)

let scheduleFetchPrice = schedule.scheduleJob(rule, function(){

  let pageNb = 1
  let url = urlSearch + pageNb.toString()
  console.log(url)
  let options = {
    uri: url,
    method: 'GET'
  }
  requestToAPI(options)
  .then(() => {
    console.log(`Schedule Job gracefully completed`)
  })
  .catch((errRequest) => {
    console.log(`Schedule Job sadly failed: ${errRequest}`)
  })
})