const chalk = require('chalk')

const log = console.log
const data = require('../../data.json')

module.exports = async (page, { link, maxPrice }) => {
  // navigates to the item link provided
  let stock = false
  let name

  // this loop will play till stock is available, then to the next step
  while (!stock) {
    await page.goto(link, { waitUntil: 'networkidle2' })

    log('searching name')

    if (!name)
      name = await page.evaluate(() =>
        [...document.getElementsByClassName('titulo')].map(el => el.textContent.trim()).join()
      )

    log(name)

    const addToCardButton = await page.$('.button-buy')

    if (addToCardButton) {
      log('searching price')
      const price =
        Number(
          await page.evaluate(() => {
            return document.querySelector("span[class='text-price-total']").textContent
            // return [...document.getElementsByClassName('container-price-total')[0].children]
            //   .map(el => el.textContent)
            //   .join()
            //   .replace(/,+/g, '.')
            //   .replace('€', '')
            //   .trim()
          })
        ) || undefined

      log(price)

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
      log(
        chalk(
          `Product ${name && chalk.bold(name)} is not yet in stock (${new Date().toUTCString()})`
        )
      )
      await page.waitForTimeout(data.refreshRate || 1000)
    }
  }

  await (await page.waitForSelector("button[class='button-buy']")).click()
  await page.waitForTimeout(2000)

  await (await page.waitForSelector("button[class='confirm']")).click()
  await page.waitForTimeout(1000)

  await page.goto('https://www.coolmod.com/carrito/pedido', { waitUntil: 'networkidle2' })

  await page.waitForTimeout(1000)

  log(chalk.yellowBright('SELECTING TRANSFER AS PAYMENT'))

  await page.evaluate('document.querySelector("input[data-slug=\'seur-24-48h\']").click()')

  await page.waitForTimeout(1500)

  log(chalk.yellowBright('Selecting bank transfer as payment on ldlc'))

  await page.evaluate("document.getElementById('payment_id_4').click()")

  await page.waitForTimeout(1000)

  await page.evaluate("document.getElementById('tosAccepted').click()")

  await page.waitForTimeout(1000)

  log(chalk.yellow('Attempting buy of ' + chalk.bold(name)))

  if (!data.debug) await page.evaluate('document.querySelector("a[class=\'button-buy\']").click()')

  await page.waitForTimeout(6000)

  return page.url().includes('https://www.coolmod.com/carrito/checkout')
}
