const { Client } = require('pg')
const config = require('config')

const client = new Client({
  user: config.get('DB.PGUSER'),
  host: config.get('DB.PGHOST'),
  database: config.get('DB.PGDATABASE'),
  password: config.get('DB.PGPASSWORD'),
  port: config.get('DB.PGPORT')
})

module.exports = {
    client
}