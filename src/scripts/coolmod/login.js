const { createCursor, getRandomPagePoint } = require('ghost-cursor')
const { randomNumberRange } = require('ghost-cursor/lib/math')
const { humanType } = require('../../utils')

module.exports = async (page, { email, password }) => {
  await page.goto('https://www.coolmod.com/mi-cuenta', {
    waitUntil: 'networkidle2'
  })

  await page.waitForTimeout(randomNumberRange(1000, 3000))

  const cursor = createCursor(page, await getRandomPagePoint(page))

  const modalCloseBtn = await page.$('button.confirm')
  if (modalCloseBtn)
    await cursor.click(modalCloseBtn, {
      waitForClick: randomNumberRange(1000, 3000),
      moveDelay: randomNumberRange(1000, 3000),
      paddingPercentage: 20
    })

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

  const userDropdown = await page.$('#usuario_login')

  return userDropdown && page.url().includes('https://www.coolmod.com/mi-cuenta')
}
