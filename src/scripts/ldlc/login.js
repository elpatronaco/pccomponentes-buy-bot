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

  await page.waitForTimeout(5000)

  // checks if logged in
  if (page.url() === 'https://secure2.ldlc.com/es-es/Account')
    log(chalk.greenBright(`Successfully logged in as ${email} on ldlc`))
  else {
    log(chalk.redBright(`Login to account with email ${email} on ldlc failed`))
    process.exit(1)
  }
}
