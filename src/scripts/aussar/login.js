module.exports = async (page, { email, password }) => {
  await page.goto('https://www.aussar.es/iniciar-sesion', { waitUntil: 'networkidle2' })

  // fills the form and logs in
  const values = await Promise.all([
    page.$("input[name='email']"),
    page.$("input[name='password']"),
    page.$('#submit-login')
  ])

  await values[0].focus()
  await page.keyboard.type(email.trim())
  await values[1].focus()
  await page.keyboard.type(password.trim())
  await values[2].click()

  await page.waitForTimeout(10000)

  return page.url() === 'https://www.aussar.es/mi-cuenta' || page.url() === 'https://www.aussar.es/'
}
