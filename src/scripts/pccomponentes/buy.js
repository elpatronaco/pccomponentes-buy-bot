const chalk = require('chalk')

const log = console.log
const data = require('../../data.json')

module.exports = async (page, { link, maxPrice }) => {
  let stock = false
  let price
  let name

  // this loop will play till stock is available, then to the next step
  while (!stock) {
    await page.goto(link, { waitUntil: 'networkidle2' })
    // when item is not in stock, the button that informs you that there's no stock has the id 'notify-me'. If it's found there's not stock.
    const buyButtons = await page.$('#btnsWishAddBuy')
    const notifyMeButton = await page.$('#notify-me')

    if (!name)
      name = await page.evaluate(
        `document.querySelector("div[class='ficha-producto__encabezado white-card-movil']").querySelector(".articulo").querySelector(".h4").querySelector("strong").textContent`
      )

    if (buyButtons !== null && notifyMeButton === null) {
      const priceAtt = await page.evaluate(
        'document.getElementById("precio-main").getAttribute("data-price")'
      )
      if (priceAtt) price = Number(priceAtt)
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

      await page.waitForTimeout(data.refreshRate ?? 1000)
    }
  }

  // buys product
  const dataId = await page.evaluate(
    "document.getElementById('contenedor-principal').getAttribute('data-id')"
  )
  if (dataId !== null)
    await page.goto(`https://www.pccomponentes.com/cart/addItem/${dataId}`, {
      waitUntil: 'networkidle2'
    })
  else {
    log('Not found product id. Forcing click of all buy buttons')
    const buyButtons = await page.$$('.buy-button')
    let clickedButton = false
    buyButtons.forEach(async buyButton => {
      if (!clickedButton)
        try {
          await buyButton.click()
          clickedButton = true
        } catch {
          log('Buy button not found, attempting another one...')
        }
    })
  }

  await page.goto('https://www.pccomponentes.com/cart/order', { waitUntil: 'networkidle2' })

  log(chalk.yellowBright('SELECTING TRANSFER AS PAYMENT'))
  const bankTransfer = await page.$("input[data-payment-name='Transferencia ordinaria']")
  await bankTransfer.click()

  while (
    (await page.$eval('#GTM-carrito-finalizarCompra', el => el.textContent)) !== 'PAGAR Y FINALIZAR'
  )
    await page.waitForTimeout(200)

  log(chalk.green('Attempting buy of ' + chalk.bold(name)))

  let attempting = true

  setTimeout(() => (attempting = false), 15000)

  while (page.url() === 'https://www.pccomponentes.com/cart/order' && attempting) {
    try {
      await page.$eval('#pccom-conditions', el => el.click())
      if (!data.debug) await page.$eval('#GTM-carrito-finalizarCompra', el => el.click())
    } catch {
      attempting = false
    }
    await page.waitForTimeout(50)
  }

  await page.waitForTimeout(5000)

  return page.url().includes('pccomponentes.com/cart/order/finished/ok')
}
