const chalk = require('chalk')

const log = console.log
const data = require('../../data.json')

module.exports = async (page, { link, maxPrice }) => {
  // navigates to the item link provided
  let stock = false
  let name
  let price

  // this loop will play till stock is available, then to the next step
  while (!stock) {
    await page.goto(link, { waitUntil: 'networkidle2' })

    if (!name)
      name = await page.evaluate(`document.querySelector("h1[class='title-1']").textContent.trim()`)

    const outOfStockSpan = await page.$("div[class='modal-stock-web pointer stock stock-9']")

    if (!outOfStockSpan) {
      price =
        Number(
          await page.evaluate(
            'document.querySelector("div[class=\'price\']").children[0].textContent.replace("€", ".")'
          )
        ) || undefined

      if (!maxPrice || (maxPrice && price && price <= maxPrice)) {
        stock = true
        log(
          chalk(
            `PRODUCT ${name && chalk.bold(name)} ${chalk.cyan('IN STOCK!')} Starting buy process`
          )
        )
      } else
        log(
          chalk.red(
            price
              ? `Price is above max. Max price set - ${maxPrice}€. Current price - ${price}€`
              : 'Price not found'
          )
        )
    } else {
      log(
        chalk(
          `Product ${name && chalk.bold(name)} is not yet in stock (${new Date().toUTCString()})`
        )
      )
      await page.waitForTimeout(data.refreshRate || 1000)
    }
  }

  await page
    .waitForSelector("a[class='button picto color2 noMarge add-to-cart-oneclic']")
    .then(async value => {
      if (value) {
        await value.focus()
        await value.click()
      } else log(chalk.redBright("Didn't find fast order button"))
    })

  log(chalk.yellowBright('SELECTING TRANSFER AS PAYMENT'))

  await page.waitForSelector('#optPayment260008').then(async value => {
    if (value) {
      await value.focus()
      await value.click()
    } else log(chalk.redBright("Didn't find bank transfer button"))
  })

  await page.waitForSelector("button[class='button color2 maxi']")

  log(chalk.yellow('Attempting buy of ' + chalk.bold(name)))

  await page.$("button[class='button color2 maxi']").then(async value => {
    if (value) {
      await value.focus()
      if (!data.debug) await value.click()
    } else log(chalk.redBright("Didn't find fast finish buy button"))
  })

  await page.waitForTimeout(5000)

  return page.url().includes('https://secure2.ldlc.com/es-es/OrderConfirmation')
}
