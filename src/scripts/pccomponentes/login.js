const { createCursor, getRandomPagePoint } = require('ghost-cursor')
const { randomNumberRange } = require('ghost-cursor/lib/math')
const { humanType } = require('../../utils')

module.exports = async (page, { email, password }) => {
  await page.goto('https://www.pccomponentes.com/login', { waitUntil: 'networkidle2' })

  await page.waitForTimeout(randomNumberRange(1000, 3000))

  const cursor = createCursor(page, await getRandomPagePoint(page))

  await cursor.click("input[data-cy='email']", {
    waitForClick: randomNumberRange(1000, 3000),
    moveDelay: randomNumberRange(1000, 3000),
    paddingPercentage: 20
  })
  await humanType(page, email.trim())

  await cursor.click("input[data-cy='password']", {
    waitForClick: randomNumberRange(1000, 3000),
    moveDelay: randomNumberRange(1000, 3000),
    paddingPercentage: 20
  })
  await humanType(page, password.trim())

  await cursor.click("button[data-cy='log-in']", {
    waitForClick: randomNumberRange(1000, 3000),
    moveDelay: randomNumberRange(1000, 3000),
    paddingPercentage: 20
  })

  await page.waitForTimeout(10000)

  return page.url().includes('https://www.pccomponentes.com/')
}
