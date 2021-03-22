const { createCursor, getRandomPagePoint } = require('ghost-cursor')
const { randomNumberRange } = require('ghost-cursor/lib/math')
const { humanType } = require('../../utils')

module.exports = async (page, { email, password }) => {
  await page.goto('https://secure2.ldlc.com/es-es/Login/Login?returnUrl=%2Fes-es%2FAccount', {
    waitUntil: 'networkidle2'
  })

  await page.waitForTimeout(randomNumberRange(1000, 3000))

  const cursor = createCursor(page, await getRandomPagePoint(page))

  await cursor.click('#Email', {
    waitForClick: randomNumberRange(1000, 3000),
    moveDelay: randomNumberRange(1000, 3000),
    paddingPercentage: 20
  })
  await humanType(page, email.trim())

  await cursor.click('#Password', {
    waitForClick: randomNumberRange(1000, 3000),
    moveDelay: randomNumberRange(1000, 3000),
    paddingPercentage: 20
  })
  await humanType(page, password.trim())
  await page.keyboard.press('Enter')

  await page.waitForTimeout(10000)

  return page.url().includes('https://secure2.ldlc.com/es-es/Account')
}
