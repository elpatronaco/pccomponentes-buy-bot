const chalk = require('chalk')

const log = console.log

module.exports = async (page, { email, password }) => {
  await page.goto('https://www.pccomponentes.com/login', { waitUntil: 'networkidle2' })

  // fills the form and logs in
  const values = await Promise.all([
    page.$("input[data-cy='email']"),
    page.$("input[data-cy='password']"),
    page.$("button[data-cy='log-in']")
  ])

  await values[0].focus()
  await page.keyboard.type(email.trim())
  await values[1].focus()
  await page.keyboard.type(password.trim())
  await page.keyboard.press('Enter')
  await values[2].click()

  await page.waitForTimeout(5000)

  return page.url() === 'https://www.pccomponentes.com/'
}
