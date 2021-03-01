const puppeteer = require('puppeteer')

module.exports = class Bot {
  // class properties
  email
  password
  items
  card
  refreshRate
  phone
  debug

  // map props to class properties
  constructor({ email, password, items, card, refreshRate, debug = false }) {
    ; (this.email = email),
      (this.password = password),
      (this.items = items),
      (this.card = card),
      (this.refreshRate = refreshRate),
      (this.debug = debug)
  }

  // main method
  async run() {
    try {
      // this creates a new chrome window
      const browser = await puppeteer.launch({ headless: !this.debug })
      let page = this.debug ? await browser.newPage() : await this.createHeadlessPage(browser)

      console.log(
        '\x1b[33m%s\x1b[0m',
        "BOT CAN'T ADD CREDIT CARD YET. BANK TRANSFER WILL BE SELECTED"
      )

      await this.login(page)

      await page.close()

      if (Array.isArray(this.items)) {
        this.items.forEach(async item => {
          const itemPage = await this.createHeadlessPage(browser)
          await this.runItem(itemPage, item)
        })
      } else {
        const itemPage = await this.createHeadlessPage(browser)
        await this.runItem(itemPage, this.items)
      }
    } catch (err) {
      console.error('ERROR NOT CAUGHT WHILE RUNNING BOT. MORE INFO BELOW')
      console.error(err)
    }
  }

  async login(page) {
    await page
      .goto('https://www.pccomponentes.com/login', { waitUntil: 'networkidle2' })
      .then(async () => {
        // fills the form and logs in
        await page.$("input[data-cy='email']").then(async value => {
          await value?.focus()
          await page.keyboard.type(this.email.trim())
        })
        await page.$("input[data-cy='password']").then(async value => {
          await value?.focus()
          await page.keyboard.type(this.password.trim())
          await page.keyboard.press('Enter')
        })
        await page.waitForNavigation({ waitUntil: 'networkidle2' })
        // checks if logged in
        if (!(page.url() == 'https://www.pccomponentes.com/'))
          throw Error(`ERROR: Login to account with email ${this.email} failed`)
        console.log(`Successfully logged in as ${this.email}`)
      })
  }

  async runItem(page, item) {
    // navigates to the item link provided
    let stock = false
    let price
    let name

    // waiting for stock loop
    while (!stock) {
      // this loop will play till stock is available, then to the next step
      await page.waitForTimeout(this.refreshRate || 5000)
      await page.goto(item.link)
      // when item is not in stock, the button that informs you that there's no stock has the id 'notify-me'. If it's found there's not stock.
      const buyButtons = await page.$('#btnsWishAddBuy')
      const notifyMeButton = await page.$('#notify-me')

      if (!name)
        name = await page.evaluate(
          `document.querySelector("div[class='ficha-producto__encabezado white-card-movil']").querySelector(".articulo").querySelector(".h4").querySelector("strong").textContent`
        )

      if (buyButtons !== null && notifyMeButton === null) {
        const priceAtt = await page.evaluate(
          'document.getElementById("precio-main").getAttribute("data-price")'
        )
        if (priceAtt) price = Number(priceAtt)
        // checks if current price is below max price before continuing
        if (!item.maxPrice || (item.maxPrice && price && price <= item.maxPrice)) {
          stock = true
          console.log(`PRODUCT ${name && name} IN STOCK! Starting buy process`)
        } else {
          console.log(
            price
              ? `Price is above max. Max price set - ${item.maxPrice}€. Current price - ${price}€`
              : 'Price not found'
          )
        }
      } else {
        // Else, proceeds to check the price and compare it to the maximum price if provided
        console.log(`Product ${name && name} is not yet in stock (${new Date().toUTCString()})`)
      }
    }

    // buys product
    const dataId = await page.evaluate(
      "document.getElementById('contenedor-principal').getAttribute('data-id')"
    )
    if (dataId !== null)
      await page.goto(`https://www.pccomponentes.com/cart/addItem/${dataId}`, {
        waitUntil: 'networkidle2'
      })
    else {
      console.log('Not found product id. Forcing click of all buy buttons')
      const buyButtons = await page.$$('.buy-button')
      let clickedButton = false
      buyButtons.forEach(async buyButton => {
        if (!clickedButton)
          try {
            await buyButton.click()
            clickedButton = true
          } catch {
            console.log('Buy button not found, attempting another one...')
          }
      })
    }

    await page.goto('https://www.pccomponentes.com/cart/order', { waitUntil: 'networkidle2' })

    // const cardNameText = await page.$eval("span[class='h5 card-name']", el => el.textContent)

    const paymentMethods = await page.$$("input[name='metodoPago']")

    // FIXME: checks if the account has an added card, if not it adds the provided one
    /* if (this.card && cardNameText && cardNameText === 'Nombre aquí') {
      console.log('Adding provided credit/debit card')

      paymentMethods[0].click()
      await this.addCard(page)
    } else {
      console.log(
        "You don't have any card on your account and you didn't provide any or you already have one card. Selecting transfer as payment"
      )

      // transfer button
      await paymentMethods[2].click()
    } */

    console.log('\x1b[33m%s\x1b[0m', 'ADDING CARD BEING WORKED ON. SELECTED TRANSFER AS PAYMENT')
    await paymentMethods[2].click()

    while (
      (await page.$eval('#GTM-carrito-finalizarCompra', el => el.textContent)) !==
      'PAGAR Y FINALIZAR'
    )
      await page.waitForTimeout(200)

    console.log('Attempting buy')

    while (page.url() === 'https://www.pccomponentes.com/cart/order') {
      await page.$eval('#pccom-conditions', el => el.click())
      if (!this.debug)
        await page.$eval('#GTM-carrito-finalizarCompra', el => el.click())
    }

    for (var i = 0; i < 50; i++) console.log('COMPRADO')
  }

  async addCard(page) {
    // clicking add card button
    const addCard = await page.waitForSelector('#addNewCard')

    if (addCard) await addCard.click()
    else console.error("Didn't find add card button")

    const cardFrames = await page.$$("iframe[class='js-iframe']")

    const data = [
      {
        frame: cardFrames[0],
        value: this.card.num,
        inputId: 'encryptedCardNumber'
      },
      {
        frame: cardFrames[1],
        value: this.card.expiryDate,
        inputId: 'encryptedExpiryDate'
      },
      {
        frame: cardFrames[2],
        value: this.card.cvc,
        inputId: 'encryptedSecurityCode'
      }
    ]

    data.forEach(async d => {
      const input = await d.frame.$(`input[id='${d.inputId}']`)
      if (input) {
        await input.focus()
        await page.keyboard.type(d.value)
      } else console.error(`Inputbox of credit card with id ${d.inputId} not found`)
    })

    const saveCardButton = await page.waitForSelector(
      "button[class='adyen-checkout__button adyen-checkout__button--pay']"
    )

    if (saveCardButton) await saveCardButton.click()
    else console.error('Save credit card button not found')
  }

  async createHeadlessPage(browser) {
    const page = await browser.newPage()

    const headlessUserAgent = await page.evaluate(() => navigator.userAgent)
    const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome')
    await page.setUserAgent(chromeUserAgent)
    await page.setExtraHTTPHeaders({
      'accept-language': 'en-US,en;q=0.8'
    })

    return page
  }
}
