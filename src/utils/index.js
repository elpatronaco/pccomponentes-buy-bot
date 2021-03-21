const fs = require('fs')
const readline = require('readline')

Array.prototype.forEachAsync = async function (fn) {
  for (let t of this) {
    await fn(t)
  }
}

const getDirectoryNames = path =>
  fs.readdirSync(path).filter(file => fs.statSync(`${path}/${file}`).isDirectory())

const sleep = async msec => new Promise(resolve => setTimeout(resolve, msec))

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = str => new Promise(resolve => rl.question(str, resolve))

const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

module.exports = { getDirectoryNames, sleep, question, rl, randomIntFromInterval }
