const puppeteer = require('puppeteer')
const chalk = require('chalk')
const log = console.log

// scripts
const pccLogin = require("./scripts/login/pccomponentes")
const pcc = require("./scripts/buy/pccomponentes")

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
      this.checkParams()

      // this creates a new chrome window
      const browser = await puppeteer.launch({ headless: !this.debug })
      let page = this.debug ? await browser.newPage() : await this.createHeadlessPage(browser)

      log(chalk.bgYellow.black("BOT CAN'T ADD CREDIT CARD YET. BANK TRANSFER WILL BE SELECTED"))

      await pccLogin(page, { email: this.email, password: this.password })

      await page.close()

      if (Array.isArray(this.items)) {
        this.items.forEach(item => this.runItemInstance(browser, pcc, item))
      } else {
        await this.runItemInstance(browser, pcc, this.items)
      }
    } catch (err) {
      log(chalk.red('ERROR NOT CAUGHT WHILE RUNNING BOT. MORE INFO BELOW'))
      log(chalk.whiteBright(err))
    }
  }

  async runItemInstance(browser, script, item) {
    let attempting = true
    do {
      const itemPage = await this.createHeadlessPage(browser)
      const result = await script(itemPage, item, { refreshRate: this.refreshRate })
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
