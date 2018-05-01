module.exports = {
  sortPerDate(a, b) {
    let dateA = a.date.split("/")
    let dateB = b.date.split("/")
    let addA= parseInt(dateA[0]) + parseInt(dateA[1]) * 100 + parseInt(dateA[2])
    let addB= parseInt(dateB[0]) + parseInt(dateB[1]) * 100 + parseInt(dateB[2])
    return addA>addB ? 1 : addA<addB ? -1 : 0
  }
}