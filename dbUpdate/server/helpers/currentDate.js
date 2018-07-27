

module.exports = {
  currentDate () {
    let currentDate = new Date()
    let month = currentDate.getUTCMonth() + 1
    let day = currentDate.getUTCDate()
    let year = currentDate.getUTCFullYear()
    return (year + '/' + month + '/' + day)
  },
  dateYesterday () {
    let currentDate = new Date()
    let year = 0
    let month = 0
    let day = 0
    if (currentDate.getUTCDate() == 1 && currentDate.getUTCMonth() == 0) { // FIRST DAY OF THE YEAR
      month = 12
      day = 31
      year = currentDate.getUTCFullYear() - 1
    } else if (currentDate.getUTCDate() == 1) { // FIRST DAY OF THE MONTH
      month = currentDate.getUTCMonth()
      day = 31
      year = currentDate.getUTCFullYear()
    } else {
      month = currentDate.getUTCMonth() + 1
      day = currentDate.getUTCDate() - 1
      year = currentDate.getUTCFullYear()
    }
    return (year + '/' + month + '/' + day)
  },
  dateLastWeek () {
    let currentDate = new Date()
    let year = 0
    let month = 0
    let day = 0
    if (currentDate.getUTCDate() <= 7 && currentDate.getUTCMonth() == 0) { // FIRST WEEK OF THE YEAR
      month = 12
      day = 31 - currentDate.getUTCDate()
      year = currentDate.getUTCFullYear() - 1
    } else if (currentDate.getUTCDate() <= 7) { // FIRST WEEK OF THE MONTH
      month = currentDate.getUTCMonth()
      day = 31 - currentDate.getUTCDate()
      year = currentDate.getUTCFullYear()
    } else {
      month = currentDate.getUTCMonth() + 1
      day = currentDate.getUTCDate() - 7
      year = currentDate.getUTCFullYear()
    }
    return (year + '/' + month + '/' + day)
  },
  dateLastMonth () {
    let currentDate = new Date()
    let year = 0
    let month = 0
    let day = 0
    if (currentDate.getUTCMonth() == 0) { // FIRST MONTH OF THE YEAR
      month = 12
      day = currentDate.getUTCDate()
      year = currentDate.getUTCFullYear() - 1
    } else {
      month = currentDate.getUTCMonth()
      day = currentDate.getUTCDate()
      year = currentDate.getUTCFullYear()
    }
    return (year + '/' + month + '/' + day)
  }
}
