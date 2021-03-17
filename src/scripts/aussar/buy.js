const chalk = require('chalk')

const log = console.log
const data = require('../../data.json')

module.exports = async (page, { link, maxPrice }) => {
  let stock = false
  let price
  let name

  // this loop will play till stock is available, then to the next step
  while (!stock) {
    await page.goto(link, { waitUntil: 'domcontentloaded' })
    // 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2'

    if (!name)
      name = await page.evaluate(
        `document.querySelector("h1[class='h1 product-detail-name']").textContent.trim()`
      )

    const buyDisabled = await page.evaluate(
      'document.querySelector("button[data-button-action=\'add-to-cart\']").disabled'
    )

    if (!buyDisabled) {
      price =
        Number(
          await page.evaluate(
            'document.querySelector("span[itemprop=\'price\']").getAttribute("content")'
          )
        ) || undefined

      // checks if current price is below max price before continuing
      if (!maxPrice || (maxPrice && price && price <= maxPrice)) {
        stock = true
        log(
          chalk(
            `PRODUCT ${name && chalk.bold(name)} ${chalk.cyan('IN STOCK!')} Starting buy process`
          )
        )
      } else {
        log(
          chalk.red(
            price
              ? `Price is above max. Max price set - ${maxPrice}€. Current price - ${price}€`
              : 'Price not found'
          )
        )
      }
    } else {
      // Else, proceeds to check the price and compare it to the maximum price if provided
      log(
        chalk(
          `Product ${name && chalk.bold(name)} is not yet in stock (${new Date().toUTCString()})`
        )
      )

      await page.waitForTimeout(data.refreshRate || 1000)
    }
  }

  await (await page.$("button[data-button-action='add-to-cart']")).click()

  // wait for item to enter the product basket
  do await page.waitForTimeout(50)
  while (
    await page.evaluate(
      'document.querySelector("span[class=\'leo-fly-cart-total\']").textContent == 1'
    )
  )

  await page.goto('https://www.aussar.es/pedido', { waitUntil: 'networkidle2' })

  const confirmAddresses = await page.$("button[name='confirm-addresses']")
  if (confirmAddresses) await confirmAddresses.click()
  else log(chalk.red("Didn't find confirm addresses button"))

  do await page.waitForTimeout(50)
  while (page.url() !== 'https://www.aussar.es/pedido')

  await page.waitForTimeout(5000)

  log('clicking delivery')

  const deliveryMethod = await page.$('#delivery_option_32')

  if (deliveryMethod) await deliveryMethod.click()
  else log(chalk.red("Didn't find GLS delivery button"))

  await (await page.waitForSelector("button[name='confirmDeliveryOption']")).click()

  await page.waitForTimeout(5000)

  log(chalk.yellowBright('SELECTING TRANSFER AS PAYMENT'))
  const bankTransfer = await page.$('#payment-option-3')
  await bankTransfer.click()

  await page.waitForTimeout(500)

  // const acceptTerms = await page.$("#conditions_to_approve[terms-and-conditions]")
  // await acceptTerms.click()
  await page.evaluate(
    'document.getElementById("conditions_to_approve[terms-and-conditions]").click()'
  )

  log(chalk.yellow('Attempting buy of ' + chalk.bold(name)))

  const buyButton = await page.$('#payment-confirmation').$("button[type='submit']")

  if (buyButton) {
    await buyButton.click()
  } else log(chalk.red("Couldn't find buy button"))

  await page.waitForTimeout(5000)

  return page.url().includes('pccomponentes.com/cart/order/finished/ok')
}
