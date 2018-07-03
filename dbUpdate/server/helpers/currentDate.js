
let date = new Date()
currentDate = new Date()
console.log(`Date before transofrmation: ${currentDate}`)
date = currentDate.getFullYear() + currentDate.getMonth() + currentDate.getDay()

module.exports = {
  currentDate () {
    let currentDate = new Date()
    let month = currentDate.getUTCMonth() + 1
    let day = currentDate.getUTCDate()
    let year = currentDate.getUTCFullYear()
    return (year + '/' + month + '/' + day)
  }
}
