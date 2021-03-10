const puppeteer = require('puppeteer')
const chalk = require('chalk')
const log = console.log

Array.prototype.forEachAsync = async function (fn) {
  for (let t of this) {
    await fn(t)
  }
}

module.exports = class Bot {
  // class properties
  pccomponentes
  ldlc
  coolmod
  debug
  browserOptions

  // map props to class properties
  constructor({ pccomponentes, ldlc, coolmod, debug = false, browserOptions }) {
    ; (this.pccomponentes = pccomponentes),
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

      const stores = [
        {
          data: this.pccomponentes,
          buy: require('./pccomponentes/buy'),
          login: require('./pccomponentes/login')
        },
        {
          data: this.ldlc,
          buy: require('./ldlc/buy'),
          login: require('./ldlc/login')
        },
        {
          data: this.coolmod,
          buy: require('./coolmod/buy'),
          login: require('./coolmod/login')
        }
      ]

      const loginPage = this.debug
        ? await browser.newPage()
        : await this.createHeadlessPage(browser)

      await stores.forEachAsync(async store => {
        if (store.data)
          await store.login(loginPage, {
            email: store.data.email,
            password: store.data.password
          })
      })

      await loginPage.close()

      await stores.forEachAsync(async store => {
        if (store.data)
          if (Array.isArray(store.data.items)) {
            store.data.items.forEach(item => this.runItemInstance(browser, store.buy, item))
          } else {
            await this.runItemInstance(browser, store.buy, store.data.items)
          }
      })
    } catch (err) {
      log(chalk.red('ERROR NOT CAUGHT WHILE RUNNING BOT. MORE INFO BELOW'))
      log(chalk.whiteBright(err))
    }
  }

  async runItemInstance(browser, script, item) {
    let attempting = true
    do {
      const itemPage = await this.createHeadlessPage(browser)

      try {
        attempting = !(await script(itemPage, item))
      } catch (err) {
        log(chalk.bgRedBright.white(err))
      }
      await itemPage.close()
      if (!attempting)
        for (var i = 0; i < 20; i++) log(chalk.greenBright('COMPRADO'))
      else
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
      store.email &&
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
