module.exports = async (page, { email, password }) => {
  await page.goto('https://www.coolmod.com/mi-cuenta', {
    waitUntil: 'networkidle2'
  })

  const values = await Promise.all([
    page.$("input[name='username']"),
    page.$("input[name='password']")
  ])
  await values[0].click()
  await values[0].focus()
  await page.keyboard.type(email.trim())
  await values[1].click()
  await values[1].focus()
  await page.keyboard.type(password.trim())
  await page.keyboard.press('Enter')

  await page.waitForTimeout(10000)

  const userDropdown = await page.$('#usuario_login')

  return userDropdown && page.url().includes('https://www.coolmod.com/mi-cuenta')
}
