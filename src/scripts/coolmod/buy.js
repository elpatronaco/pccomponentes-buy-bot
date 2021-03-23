const chalk = require('chalk')

const log = console.log
const data = require('../../data.json')

module.exports = async (page, { link }) => {
  await page.goto(link, { waitUntil: 'domcontentloaded' })

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

  log(chalk.yellow('Attempting buy of'))

  if (!data.debug && !data.test)
    await page.evaluate('document.querySelector("a[class=\'button-buy\']").click()')

  await page.waitForTimeout(6000)

  return page.url().includes('https://www.coolmod.com/carrito/checkout')
}
