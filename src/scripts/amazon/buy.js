const chalk = require('chalk')

const log = console.log
const data = require('../../data.json')

const { createCursor, getRandomPagePoint } = require('ghost-cursor')
const { randomNumberRange } = require('ghost-cursor/lib/math')

module.exports = async (page, link, customLog) => {
  await page.goto(link, {
    waitUntil: 'domcontentloaded'
  })

  await page.waitForTimeout(1000)

  const cursor = await createCursor(page, await getRandomPagePoint(page), true)

  const fastBuyButton = await page.waitForSelector('#buy-now-button', { visible: true })
  await cursor.click(fastBuyButton, {
    waitForClick: randomNumberRange(200, 1000),
    moveDelay: randomNumberRange(500, 1500),
    paddingPercentage: 30
  })

  customLog(chalk.yellow('Attempting amazon fast buy'))

  const frameHandle = await page.waitForSelector('#turbo-checkout-iframe')
  const frame = await frameHandle.contentFrame()

  const finishButton = await frame.waitForSelector('input#turbo-checkout-pyo-button', {
    visible: true
  })
  if (!data.debug)
    await cursor.click(finishButton, {
      waitForClick: randomNumberRange(200, 1000),
      moveDelay: randomNumberRange(500, 1500),
      paddingPercentage: 30
    })

  await page.waitForTimeout(10000)

  // TODO: CORREGIR URL AL FINALIZAR PEDIDO
  return page.url().includes('amazon.es')
}
