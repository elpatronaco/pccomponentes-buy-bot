const puppeteer = require('puppeteer')
const chalk = require('chalk')
const log = console.log

module.exports = class Bot {
  // class properties
  email
  password
  items
  card
  refreshRate
  debug

  // map props to class properties
  constructor({ email, password, items, card, refreshRate = 1000, debug = false }) {
    ;(this.email = email),
      (this.password = password),
      (this.items = items),
      (this.card = card),
      (this.refreshRate = refreshRate),
      (this.debug = debug)
  }

  // main method
  async run() {
    try {
      this.checkParams()

      // this creates a new chrome window
      const browser = await puppeteer.launch({ headless: !this.debug })
      let page = this.debug ? await browser.newPage() : await this.createHeadlessPage(browser)

      log(chalk.bgYellow.black("BOT CAN'T ADD CREDIT CARD YET. BANK TRANSFER WILL BE SELECTED"))

      await this.login(page)

      await page.close()

      if (Array.isArray(this.items)) {
        this.items.forEach(item => this.runItemInstance(browser, item))
      } else {
        await this.runItemInstance(browser, this.items)
      }
    } catch (err) {
      log(chalk.red('ERROR NOT CAUGHT WHILE RUNNING BOT. MORE INFO BELOW'))
      log(chalk.whiteBright(err))
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
        await page.waitForTimeout(8000)
        // checks if logged in
        if (!(page.url() == 'https://www.pccomponentes.com/')) {
          log(chalk.redBright(`Login to account with email ${this.email} failed`))
          process.exit(1)
        } else log(chalk.greenBright(`Successfully logged in as ${this.email}`))
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
      await page.waitForTimeout(this.refreshRate)
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
          log(
            chalk(
              `PRODUCT ${name && chalk.bold(name)} ${chalk.cyan('IN STOCK!')} Starting buy process`
            )
          )
        } else {
          log(
            chalk.red(
              price
                ? `Price is above max. Max price set - ${item.maxPrice}€. Current price - ${price}€`
                : 'Price not found'
            )
          )
        }
      } else {
        // Else, proceeds to check the price and compare it to the maximum price if provided
        log(
          chalk(
            `Product ${name && chalk.bold(name)} is not yet in stock (${new Date().toUTCString()})`
          )
        )
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
      log('Not found product id. Forcing click of all buy buttons')
      const buyButtons = await page.$$('.buy-button')
      let clickedButton = false
      buyButtons.forEach(async buyButton => {
        if (!clickedButton)
          try {
            await buyButton.click()
            clickedButton = true
          } catch {
            log('Buy button not found, attempting another one...')
          }
      })
    }

    await page.goto('https://www.pccomponentes.com/cart/order', { waitUntil: 'networkidle2' })

    // const paymentMethods = await page.$$("input[name='metodoPago']")

    // const cardNameText = await page.$eval("span[class='h5 card-name']", el => el.textContent)

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

    // TEMPORARY
    log(chalk.bgYellow.black('ADDING CARD BEING WORKED ON. SELECTING TRANSFER AS PAYMENT'))
    const bankTransfer = await page.$("input[data-payment-name='Transferencia ordinaria']")
    await bankTransfer.click()

    while (
      (await page.$eval('#GTM-carrito-finalizarCompra', el => el.textContent)) !==
      'PAGAR Y FINALIZAR'
    )
      await page.waitForTimeout(200)

    log(chalk.bold('Attempting buy'))

    let attempting = true

    setTimeout(() => (attempting = false), 15000)

    while (page.url() === 'https://www.pccomponentes.com/cart/order' && attempting) {
      try {
        await page.$eval('#pccom-conditions', el => el.click())
        if (!this.debug) await page.$eval('#GTM-carrito-finalizarCompra', el => el.click())
      } catch {
        attempting = false
      }
      await page.waitForTimeout(50)
    }

    await page.waitForTimeout(5000)

    return page.url().includes('pccomponentes.com/cart/order/finished/ok')
  }

  async addCard(page) {
    // clicking add card button
    const addCard = await page.waitForSelector('#addNewCard')

    if (addCard) await addCard.click()
    else log(chalk.redBright("Didn't find add card button"))

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
      } else log(chalk.redBright(`Inputbox of credit card with id ${d.inputId} not found`))
    })

    const saveCardButton = await page.waitForSelector(
      "button[class='adyen-checkout__button adyen-checkout__button--pay']"
    )

    if (saveCardButton) await saveCardButton.click()
    else log(chalk.redBright('Save credit card button not found'))
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

  async runItemInstance(browser, item) {
    let attempting = true
    do {
      const itemPage = await this.createHeadlessPage(browser)
      const result = await this.runItem(itemPage, item)
      await itemPage.close()
      if (result) {
        attempting = false
        for (var i = 0; i < 20; i++) log(chalk.greenBright('COMPRADO'))
      } else
        log(
          chalk
            .hex('#ffa500')
            .italic('ITEM NOT BOUGHT FOR WHATEVER REASON, WAITING AGAIN FOR STOCK')
        )
    } while (attempting)
  }

  checkParams() {
    if (
      !(
        this.items &&
        typeof this.email === 'string' &&
        this.password &&
        typeof this.password === 'string' &&
        this.items &&
        (Array.isArray(this.items) || typeof this.items === 'object')
      )
    ) {
      log(
        chalk.bgRed('One parameter or many is/are incorrect, compare them with the ones on github')
      )
      process.exit(1)
    }
  }
}
