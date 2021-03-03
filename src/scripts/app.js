const puppeteer = require('puppeteer')
const chalk = require('chalk')
const log = console.log

// scripts
const pccLogin = require('./pccomponentes/login')
const pcc = require('./pccomponentes/buy')

const ldlcLogin = require('./ldlc/login')
const ldlc = require('./ldlc/buy')

const coolmodLogin = require('./coolmod/login')
const coolmod = require('./coolmod/buy')

module.exports = class Bot {
  // class properties
  pccomponentes
  ldlc
  coolmod
  debug
  browserOptions

  // map props to class properties
  constructor({ pccomponentes, ldlc, coolmod, debug = false, browserOptions }) {
    ;(this.pccomponentes = pccomponentes),
      (this.ldlc = ldlc),
      (this.coolmod = coolmod),
      (this.debug = debug),
      (this.browserOptions = browserOptions)
  }

  // main method
  async run() {
    try {
      this.checkParams()

      // this creates a new chrome window
      const browser = await puppeteer.launch(
        this.debug ? this.browserOptions.debug : this.browserOptions.headless
      )
      const loginPage = this.debug
        ? await browser.newPage()
        : await this.createHeadlessPage(browser)

      if (this.pccomponentes)
        await pccLogin(loginPage, {
          email: this.pccomponentes.email,
          password: this.pccomponentes.password
        })

      if (this.ldlc)
        await ldlcLogin(loginPage, { email: this.ldlc.email, password: this.ldlc.password })

      if (this.coolmod)
        await coolmodLogin(loginPage, {
          email: this.coolmod.email,
          password: this.coolmod.password
        })

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

      if (this.coolmod)
        if (Array.isArray(this.coolmod.items)) {
          this.coolmod.items.forEach(item => this.runItemInstance(browser, coolmod, item))
        } else {
          await this.runItemInstance(browser, coolmod, this.coolmod.items)
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
    const check = store =>
      store &&
      store.items &&
      typeof store.email === 'string' &&
      store.password &&
      typeof store.password === 'string' &&
      store.items &&
      (Array.isArray(store.items) || typeof store.items === 'object')

    if (!(check(this.pccomponentes) || check(this.ldlc) || check(this.coolmod))) {
      log(
        chalk.bgRed(
          'One parameter or many in file data.json is/are incorrect, compare them with the ones on github'
        )
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
