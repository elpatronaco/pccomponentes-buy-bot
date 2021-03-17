const puppeteer = require('puppeteer')
const chalk = require('chalk')

const log = console.log

module.exports = async (page, { email, password }) => {
  await page.goto('https://secure2.ldlc.com/es-es/Login/Login?returnUrl=%2Fes-es%2FAccount', {
    waitUntil: 'networkidle2'
  })

  // fills the form and logs in
  const values = await Promise.all([page.$('#Email'), page.$('#Password')])
  await values[0].focus()
  await page.keyboard.type(email.trim())
  await values[1].focus()
  await page.keyboard.type(password.trim())
  await page.keyboard.press('Enter')

  await page.waitForTimeout(10000)

  return page.url().includes('https://secure2.ldlc.com/es-es/Account')
}
