const puppeteer = require('puppeteer')
const chalk = require('chalk')
const log = console.log

// scripts
const pccLogin = require('./pccomponentes/login')
const pcc = require('./pccomponentes/buy')

const ldlcLogin = require('./ldlc/login')
const ldlc = require('./ldlc/buy')

module.exports = class Bot {
  // class properties
  pccomponentes
  ldlc
  debug
  browserOptions

  // map props to class properties
  constructor({ pccomponentes, ldlc, debug = false, browserOptions }) {
    ; (this.pccomponentes = pccomponentes), (this.ldlc = ldlc), (this.debug = debug), (this.browserOptions = browserOptions)
  }

  // main method
  async run() {
    try {
      this.checkParams()

      // this creates a new chrome window
      const browser = await puppeteer.launch(this.debug ? this.browserOptions.debug : this.browserOptions.headless)
      let loginPage = this.debug ? await browser.newPage() : await this.createHeadlessPage(browser)

      log(chalk.bgYellow.black("BOT CAN'T ADD CREDIT CARD YET ON PCCOMPONENTES. BANK TRANSFER WILL BE SELECTED"))

      if (this.pccomponentes)
        await pccLogin(loginPage, { email: this.pccomponentes.email, password: this.pccomponentes.password })

      if (this.ldlc)
        await ldlcLogin(loginPage, { email: this.ldlc.email, password: this.ldlc.password })

      await loginPage.close()

      if (this.pccomponentes)
        if (Array.isArray(this.pccomponentes.items)) {
          this.pccomponentes.items.forEach(item => this.runItemInstance(browser, pcc, item))
        } else {
          await this.runItemInstance(browser, pcc, this.pccomponentes.items)
        }

      if (this.ldlc)
        if (Array.isArray(this.ldlc.items)) {
          this.ldlc.items.forEach(item => this.runItemInstance(browser, ldlc, item))
        } else {
          await this.runItemInstance(browser, ldlc, this.ldlc.items)
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
      const result = await script(itemPage, item)
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
        this.pccomponentes &&
        this.pccomponentes.items &&
        typeof this.pccomponentes.email === 'string' &&
        this.pccomponentes.password &&
        typeof this.pccomponentes.password === 'string' &&
        this.pccomponentes.items &&
        (Array.isArray(this.pccomponentes.items) || typeof this.pccomponentes.items === 'object')
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
