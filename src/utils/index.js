const fs = require('fs')
const { randomNumberRange } = require('ghost-cursor/lib/math')
const readline = require('readline')

Array.prototype.forEachAsync = async function (fn) {
  for (let t of this) {
    await fn(t)
  }
}

String.prototype.forEachAsync = async function (fn) {
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

const humanType = async (page, str) => {
  await [...str].forEachAsync(async letter => {
    await page.keyboard.type(letter)
    await page.waitForTimeout(randomNumberRange(30, 100))
  })
}

const cleanChalkMsg = msg => msg.replace(/\[[0-9]+m/g, '')

module.exports = { getDirectoryNames, sleep, question, rl, humanType, cleanChalkMsg }
