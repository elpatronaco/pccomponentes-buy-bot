const puppeteer = require('puppeteer')
const chalk = require('chalk')

const log = console.log

module.exports = async (page, { email, password }) => {
  await page
    .goto('https://www.pccomponentes.com/login', { waitUntil: 'networkidle2' })
    .then(async () => {
      // fills the form and logs in
      await page.$("input[data-cy='email']").then(async value => {
        await value.focus()
        await page.keyboard.type(email.trim())
      })
      await page.$("input[data-cy='password']").then(async value => {
        await value.focus()
        await page.keyboard.type(password.trim())
        await page.keyboard.press('Enter')
      })
      await page.waitForTimeout(5000)
      // checks if logged in
      if (page.url() === 'https://www.pccomponentes.com/')
        log(chalk.greenBright(`Successfully logged in as ${email} in pccomponentes`))
      else {
        log(chalk.redBright(`Login to pccomponentes account with email ${email} failed`))
        process.exit(1)
      }
    })
}
