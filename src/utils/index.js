const fs = require('fs')

Array.prototype.forEachAsync = async function (fn) {
  for (let t of this) {
    await fn(t)
  }
}

const getDirectoryNames = path =>
  fs.readdirSync(path).filter(file => fs.statSync(`${path}/${file}`).isDirectory())

const sleep = async msec => new Promise(resolve => setTimeout(resolve, msec))

module.exports = { getDirectoryNames, sleep }
