const chalk = require('chalk')

const log = console.log

module.exports = async (page, { email, password }) => {
  await page.goto('https://www.coolmod.com/mi-cuenta', {
    waitUntil: 'networkidle2'
  })

  const values = await Promise.all([
    page.$("input[name='username']"),
    page.$("input[name='password']")
  ])
  await values[0].click()
  await values[0].focus()
  await page.keyboard.type(email.trim())
  await values[1].click()
  await values[1].focus()
  await page.keyboard.type(password.trim())
  await page.evaluate('document.querySelector("input[type=\'submit\']").click()')

  await page.waitForTimeout(8000)

  const emailInput = await page.$("input[name='username']")

  // checks if logged in
  if (
    (emailInput === undefined || emailInput === null) &&
    page.url().includes('https://www.coolmod.com/mi-cuenta')
  )
    log(chalk.greenBright(`Successfully logged in as ${email} on coolmod`))
  else {
    log(chalk.redBright(`Login to account with email ${email} on coolmod failed`))
    process.exit(1)
  }
}
