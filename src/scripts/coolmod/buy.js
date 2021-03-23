const chalk = require('chalk')
const data = require('../../data.json')

module.exports = async (page, link, customLog) => {
  await page.goto(link, { waitUntil: 'domcontentloaded' })

  await (await page.waitForSelector("button[class='button-buy']")).click()
  await page.waitForTimeout(2000)

  await (await page.waitForSelector("button[class='confirm']")).click()
  await page.waitForTimeout(1000)

  await page.goto('https://www.coolmod.com/carrito/pedido', { waitUntil: 'networkidle2' })

  await page.waitForTimeout(1000)

  await page.evaluate('document.querySelector("input[data-slug=\'seur-24-48h\']").click()')

  await page.waitForTimeout(1500)

  customLog(chalk.yellowBright('Selecting bank transfer as payment'))

  await page.evaluate("document.getElementById('payment_id_4').click()")

  await page.waitForTimeout(1000)

  await page.evaluate("document.getElementById('tosAccepted').click()")

  await page.waitForTimeout(1000)

  customLog(chalk.yellow('Attempting buy'))

  if (!data.debug && !data.test)
    await page.evaluate('document.querySelector("a[class=\'button-buy\']").click()')

  await page.waitForTimeout(6000)

  return page.url().includes('https://www.coolmod.com/carrito/checkout')
}
