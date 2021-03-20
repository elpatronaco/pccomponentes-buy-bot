const puppeteer = require('puppeteer')
const chalk = require('chalk')
const log = console.log
const data = require('../data.json')
const path = require('path')
const { getDirectoryNames, sleep } = require('../utils')

module.exports = class Bot {
  stores

  // main method
  async run() {
    try {
      this.stores = getDirectoryNames(__dirname)

      this.checkParams()

      log(`Starting bot`)

      // console.time('test')
      // log(await require('./ldlc/scrape')({
      //   link:
      //     'https://www.ldlc.com/es-es/ficha/PB00385535.html'
      // }))
      // console.timeEnd('test')

      // this creates a new chrome instance
      const browser = await puppeteer.launch(
        data.debug
          ? data.browserOptions.debug
          : {
            executablePath:
              process.platform === 'linux' ? '/usr/bin/chromium-browser' : undefined,
            ...data.browserOptions.headless
          }
      )

      await this.stores.forEachAsync(async store => {
        if (data[store]) {
          const loginPage = data.debug
            ? await browser.newPage()
            : await this.createHeadlessPage(browser)

          log(`Attempting login in ${store}`)

          const loginResult = await require(path.join(__dirname, store, 'login'))(loginPage, {
            email: data[store].email,
            password: data[store].password
          })

          if (loginResult)
            log(chalk.green(`Successfully logged in as ${data[store].email} to ${store}`))
          else {
            log(chalk.red(`Login on ${store} failed. Check your credentials`))
            process.exit(1)
          }

          await loginPage.close()
        }
      })

      this.stores.forEach(store => {
        if (data[store]) {
          if (Array.isArray(data[store].items))
            data[store].items.forEach(item => this.runItemInstance(browser, store, item))
          else this.runItemInstance(browser, store, data[store].items)
        }
      })
    } catch (err) {
      log(chalk.bgRedBright.white('! EXCEPTION NOT CAUGHT WHILE RUNNING BOT. MORE INFO BELOW !'))
      log(chalk.whiteBright(err))
    }
  }

  async runItemInstance(browser, store, item) {
    const scrape = require(path.join(__dirname, store, 'scrape'))
    const buy = require(path.join(__dirname, store, 'buy'))

    let attempting = true
    do {
      try {
        let canBuy = false
        do {
          const resp = await scrape(item)
          if (resp.stock) {
            if (item.maxPrice <= resp.price) {
              log(
                chalk.red(
                  `Price is above max. Max price set - ${maxPrice}€. Current price - ${price}€`
                )
              )
            } else {
              log(
                chalk(
                  `PRODUCT ${resp.name && chalk.bold(resp.name)} ${chalk.cyan(
                    'IN STOCK!'
                  )} Starting buy process`
                )
              )
              canBuy = true
            }
          } else {
            log(
              chalk(
                `Product ${resp.name && chalk.bold(resp.name)
                } is not yet in stock (${new Date().toUTCString()})`
              )
            )
            await sleep(data.refreshRate || 1000)
          }
        } while (!canBuy)

        // buys item
        const itemPage = await this.createHeadlessPage(browser)
        attempting = !(await buy(itemPage, item))
        await itemPage.close()
      } catch (err) {
        log(chalk.redBright(err))
      }

      if (!attempting) {
        for (var i = 0; i < 20; i++) log(chalk.greenBright('COMPRADO'))

        if (data.onlyOneBuy) {
          log('You set onlyOneBuy to true, exiting the app...')
          process.exit(1)
        }
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
      store.email &&
      typeof store.email === 'string' &&
      store.password &&
      typeof store.password === 'string' &&
      store.items &&
      (Array.isArray(store.items) || typeof store.items === 'object')

    let correctStores = 0

    this.stores.forEach(store => {
      if (check(data[store])) correctStores++
    })

    if (correctStores === 0) {
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

    page.setDefaultNavigationTimeout(data.timeout || 0)
    const headlessUserAgent = await page.evaluate(() => navigator.userAgent)
    const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome')
    await page.setUserAgent(chromeUserAgent)
    await page.setExtraHTTPHeaders({
      'accept-language': 'es-ES,es;q=0.8'
    })

    return page
  }
}
