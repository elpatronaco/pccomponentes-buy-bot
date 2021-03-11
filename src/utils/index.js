const fs = require('fs')

Array.prototype.forEachAsync = async function (fn) {
  for (let t of this) {
    await fn(t)
  }
}

const getDirectoryNames = path =>
  fs.readdirSync(path).filter(file => fs.statSync(`${path}/${file}`).isDirectory())

module.exports = { getDirectoryNames }
