const log = console.log
const chalk = require('chalk')
const { question } = require('../../utils')
const { createCursor, getRandomPagePoint } = require('ghost-cursor')
const { randomNumberRange } = require('ghost-cursor/lib/math')

module.exports = async (page, { email, password }) => {
  log(
    chalk(
      `${chalk.redBright('[WARNING]')} ${chalk.bold(
        `It is easy to get banned on Amazon for botting. Steps are done to mimick human behavior, like random timeouts and human-like cursor movements, but you still can get caught. Check out these guidelines first: ${chalk.blueBright(
          'https://bit.ly/391QRBo'
        )}`
      )}`
    )
  )

  await page.goto(
    'https://www.amazon.es/ap/signin?openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.amazon.es%2Fgp%2Fcss%2Fhomepage.html%3Fie%3DUTF8%26%252AVersion%252A%3D1%26%252Aentries%252A%3D0%26ref_%3Dnav_signin&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.assoc_handle=esflex&openid.mode=checkid_setup&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&',
    { waitUntil: 'networkidle2' }
  )

  await page.waitForTimeout(randomNumberRange(2000, 5000))

  const cursor = createCursor(page, await getRandomPagePoint(page), true)

  await page.waitForTimeout(randomNumberRange(2000, 5000))
  const emailInp = await page.$("input[type='email']")
  await cursor.click(emailInp, {
    waitForClick: randomNumberRange(1000, 3000),
    moveDelay: randomNumberRange(1000, 3000),
    paddingPercentage: 20
  })
  await page.keyboard.type(email.trim())
  await page.keyboard.press('Enter')

  await page.waitForTimeout(randomNumberRange(2000, 5000))
  const passInput = await page.$("input[type='password']")
  await cursor.click(passInput, {
    waitForClick: randomNumberRange(1000, 3000),
    moveDelay: randomNumberRange(1000, 3000),
    paddingPercentage: 20
  })
  await page.keyboard.type(password.trim())
  await page.keyboard.press('Enter')

  await page.waitForTimeout(randomNumberRange(2000, 5000))

  const twofaInput = await page.$('#auth-mfa-otpcode')

  if (twofaInput) {
    const code = await question(
      chalk.blueBright('2FA is enabled. A code has been sent to your phone, what is it? ')
    )

    await cursor.click(twofaInput, {
      waitForClick: randomNumberRange(1000, 3000),
      moveDelay: randomNumberRange(1000, 3000),
      paddingPercentage: 20
    })
    await page.keyboard.type(code.trim())
    await page.keyboard.press('Enter')
  } else if (page.url().includes('https://www.amazon.es/ap/cvf/approval')) {
    log(
      chalk.blueBright(
        `Amazon has sent an email to the account ${chalk.bold(email)}. Please approve it`
      )
    )

    await question(chalk.blueBright('Type enter to continue'))
  }

  await page.waitForTimeout(10000)

  return page.url().includes('https://www.amazon.es/gp/css/homepage.html')
}
