const chalk = require('chalk')

const log = console.log
const data = require('../../data.json')

module.exports = async (page, link, customLog) => {
  await page.goto(link, {
    waitUntil: 'domcontentloaded'
  })

  // buys product
  const dataId = await page.evaluate(
    "document.getElementById('contenedor-principal').getAttribute('data-id')"
  )

  if (dataId)
    await page.goto(`https://www.pccomponentes.com/cart/addItem/${dataId}`, {
      waitUntil: 'networkidle2'
    })
  else {
    customLog('Not found product id. Forcing click of all buy buttons')
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

  customLog(chalk.yellowBright('SELECTING TRANSFER AS PAYMENT'))
  const bankTransfer = await page.$("input[data-payment-name='Transferencia ordinaria']")
  await bankTransfer.click()

  while (
    (await page.$eval('#GTM-carrito-finalizarCompra', el => el.textContent)) !== 'PAGAR Y FINALIZAR'
  )
    await page.waitForTimeout(200)

  customLog(chalk.yellow('Attempting buy'))

  let attempting = true

  setTimeout(() => (attempting = false), 15000)

  while (page.url() === 'https://www.pccomponentes.com/cart/order' && attempting) {
    try {
      if (data.debug) await page.$eval('#pccom-conditions', el => el.click())
      else if (data.test) return page.url().includes('pccomponentes.com/cart/order/finished/ok')
      else await page.$eval('#GTM-carrito-finalizarCompra', el => el.click())
    } catch {
      attempting = false
    }
    await page.waitForTimeout(50)
  }

  await page.waitForTimeout(5000)

  return page.url().includes('pccomponentes.com/cart/order/finished/ok')
}
