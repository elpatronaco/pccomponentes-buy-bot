const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const Adblocker = require('puppeteer-extra-plugin-stealth')
const chalk = require('chalk')
const log = console.log
const data = require('../data.json')
const path = require('path')
const { getDirectoryNames, sleep } = require('../utils')

puppeteer.use(StealthPlugin())
puppeteer.use(Adblocker())

module.exports = class Bot {
  stores

  // main method
  async run() {
    try {
      this.stores = getDirectoryNames(__dirname)

      this.checkParams()

      log(
        chalk(
          `Starting bot with version ${chalk.cyan(
            `v${require('../../package.json').version}`
          )}\n${chalk.bgRed(
            'DISCLAIMER'
          )}: Use of this bot is neither legal nor illegal (at least in ${chalk(
            chalk.red('Sp') + chalk.yellow('a') + chalk.red('in')
          )}). You are responsible for your own actions and should never blame maintainers/contributors\n`
        )
      )

      const browser = await puppeteer.launch(
        data.debug ? data.browserOptions.debug : data.browserOptions.headless
      )

      await this.stores.forEachAsync(async store => {
        if (data[store]) {
          const loginPage = data.debug
            ? await browser.newPage()
            : await this.createHeadlessPage(browser, store)

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

      if (!data.test)
        await this.stores.forEachAsync(async store => {
          if (data[store]) {
            if (Array.isArray(data[store].items))
              await data[store].items.forEachAsync(async item => {
                this.runItemInstance(browser, store, item)
                await sleep(50)
              })
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

    let resp

    const customLog = content =>
      log(chalk(`[${chalk.cyanBright(store)}] ${resp.name && resp.name.substr(0, 35)}: ${content}`))

    let attempting = true
    do {
      try {
        let canBuy = false
        do {
          resp = await scrape(item)
          if (resp.stock) {
            if (!item.maxPrice || (item.maxPrice && resp.price <= item.maxPrice)) {
              customLog(
                chalk.greenBright(
                  `PRODUCT IN STOCK at ${chalk.bold(resp.price)}€! ${
                    item.maxPrice && `Max price set is ${chalk.bold(item.maxPrice)}€. `
                  } Starting buy process`
                )
              )
              canBuy = true
            } else {
              customLog(
                chalk.red(
                  `Price is above max. Max price set - ${chalk.bold(
                    item.maxPrice
                  )}€. Current price - ${chalk.bold(resp.price)}€`
                )
              )
            }
          } else {
            customLog(chalk.blueBright(`Product is not yet in stock (${new Date().toUTCString()}`))
          }
          if (!canBuy) await sleep(data.refreshRate || 1000)
        } while (!canBuy)

        // buys item
        const itemPage = await this.createHeadlessPage(browser, store)
        attempting = !(await buy(itemPage, item.link, customLog))
        await itemPage.close()
      } catch (err) {
        log(chalk.redBright(err))
      }

      if (!attempting) {
        for (let i = 0; i < 10; i++) customLog(chalk.greenBright('COMPRADO'))

        if (data.onlyOneBuy) {
          log('You set onlyOneBuy to true, exiting the app...')
          process.exit(1)
        }
      } else
        customLog(
          chalk.hex('#ffa500')('ITEM NOT BOUGHT FOR WHATEVER REASON, WAITING AGAIN FOR STOCK')
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

  async createHeadlessPage(browser, store) {
    const page = await browser.newPage()

    // if (store === "amazon") page.setViewPort({ width: randomNumberRange(800, 1920), height: randomNumberRange(600, 1080) })

    const headlessUserAgent = await page.evaluate(() => navigator.userAgent)
    const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome')
    await page.setUserAgent(chromeUserAgent)
    await page.setExtraHTTPHeaders({
      'accept-language': 'es-ES,es;q=0.8'
    })

    return page
  }
}
