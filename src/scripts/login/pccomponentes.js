const puppeteer = require('puppeteer')

module.exports = async (page, info) => {
  await page
    .goto('https://www.pccomponentes.com/login', { waitUntil: 'networkidle2' })
    .then(async () => {
      // fills the form and logs in
      await page.$("input[data-cy='email']").then(async value => {
        await value?.focus()
        await page.keyboard.type(info.email.trim())
      })
      await page.$("input[data-cy='password']").then(async value => {
        await value?.focus()
        await page.keyboard.type(info.password.trim())
        await page.keyboard.press('Enter')
      })
      await page.waitForTimeout(8000)
      // checks if logged in
      if (!(page.url() == 'https://www.pccomponentes.com/')) {
        log(chalk.redBright(`Login to account with email ${this.email} failed`))
        process.exit(1)
      } else log(chalk.greenBright(`Successfully logged in as ${this.email}`))
    })
}
