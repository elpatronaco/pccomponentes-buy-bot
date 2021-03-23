const { createCursor, getRandomPagePoint } = require('ghost-cursor')
const { randomNumberRange } = require('ghost-cursor/lib/math')
const { humanType } = require('../../utils')

module.exports = async (page, { email, password }) => {
  await page.goto('https://www.coolmod.com/mi-cuenta', {
    waitUntil: 'networkidle2'
  })

  await page.waitForTimeout(randomNumberRange(1000, 3000))

  const cursor = createCursor(page, await getRandomPagePoint(page))

  await page.evaluate("[...document.getElementsByClassName('confirm')].forEach(el => el.click())")

  await cursor.click("input[name='username']", {
    waitForClick: randomNumberRange(1000, 3000),
    moveDelay: randomNumberRange(1000, 3000),
    paddingPercentage: 20
  })
  await humanType(page, email.trim())

  await cursor.click("input[name='password']", {
    waitForClick: randomNumberRange(1000, 3000),
    moveDelay: randomNumberRange(1000, 3000),
    paddingPercentage: 20
  })
  await humanType(page, password.trim())
  await page.keyboard.press('Enter')

  await page.waitForTimeout(10000)

  const emailInp = await page.$("input[name='username']")

  return !emailInp && page.url().includes('https://www.coolmod.com/mi-cuenta')
}
