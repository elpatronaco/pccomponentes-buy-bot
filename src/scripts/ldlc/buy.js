const chalk = require('chalk')

const data = require('../../data.json')

module.exports = async (page, link, customLog) => {
  await page.goto(link, { waitUntil: 'domcontentloaded' })

  await page
    .waitForSelector("a[class='button picto color2 noMarge add-to-cart-oneclic']")
    .then(async value => {
      if (value) {
        await value.focus()
        await value.click()
      } else log(chalk.redBright("Didn't find fast order button"))
    })

  customLog(chalk.yellowBright('SELECTING TRANSFER AS PAYMENT'))

  await page.waitForSelector('#optPayment260008').then(async value => {
    if (value) {
      await value.focus()
      await value.click()
    } else customLog(chalk.redBright("Didn't find bank transfer button"))
  })

  await page.waitForSelector("button[class='button color2 maxi']")

  customLog(chalk.yellow('Attempting buy of'))

  await page.$("button[class='button color2 maxi']").then(async value => {
    if (value) {
      await value.focus()
      if (!data.debug) await value.click()
    } else customLog(chalk.redBright("Didn't find fast finish buy button"))
  })

  await page.waitForTimeout(5000)

  return page.url().includes('https://secure2.ldlc.com/es-es/OrderConfirmation')
}
