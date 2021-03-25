const telegram = require('../controllers/telegram')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const Adblocker = require('puppeteer-extra-plugin-stealth')
const chalk = require('chalk')
const log = console.log
const data = require('../data.json')
const path = require('path')
const { getDirectoryNames, sleep, cleanChalkMsg } = require('../utils')

puppeteer.use(StealthPlugin())
puppeteer.use(Adblocker())

module.exports = class Bot {
  browser
  stores
  telegramController
  runningItems = []

  async run() {
    try {
      this.stores = getDirectoryNames(__dirname)

      this.checkParams()

      log(
        chalk(
          `\nStarting bot with version ${chalk.cyan(
            `v${require('../../package.json').version}`
          )}\n${chalk.bgRed(
            'DISCLAIMER'
          )}: Use of this bot is neither legal nor illegal (at least in ${chalk(
            chalk.red('Sp') + chalk.yellow('a') + chalk.red('in')
          )}). You are responsible for your own actions and should never blame maintainers/contributors\n`
        )
      )

      if (
        data.telegram &&
        data.telegram.enabled &&
        data.telegram.bot_token &&
        data.telegram.chat_id
      ) {
        log(chalk.cyan('Telegram notifications enabled \n'))

        this.telegramController = await telegram(
          data.telegram.chat_id,
          data.telegram.bot_token,
          this
        )
      }

      this.browser = await puppeteer.launch(
        data.debug
          ? data.browserOptions.debug
          : data.browserOptions.headless
      )

      await this.stores.forEachAsync(async store => {
        if (data[store]) {
          const loginPage = data.debug
            ? await this.browser.newPage()
            : await this.createHeadlessPage()

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

      await this.stores.forEachAsync(async store => {
        if (data[store]) {
          if (Array.isArray(data[store].items))
            await data[store].items.forEachAsync(async item => {
              this.runItemInstance(store, item)
              await sleep(50)
            })
          else this.runItemInstance(store, data[store].items)
        }
      })
    } catch (err) {
      log(chalk.bgRedBright.white('! EXCEPTION NOT CAUGHT WHILE RUNNING BOT. MORE INFO BELOW !'))
      log(chalk.whiteBright(err))
    }
  }

  async runItemInstance(store, item) {
    const scrape = require(path.join(__dirname, store, 'scrape'))
    const buy = require(path.join(__dirname, store, 'buy'))

    this.runningItems.push({ store: store, bought: false, ...item })

    let resp

    const customLog = content => {
      const msg = chalk(
        `[${chalk.cyanBright(store)}] ${resp.name && resp.name.substr(0, 35)}: ${content}`
      )

      if (this.telegramController && !msg.includes('Product is not yet in stock'))
        this.telegramController.sendMessage(cleanChalkMsg(msg))
      log(msg)
    }

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
        const itemPage = await this.createHeadlessPage()
        attempting = !(await buy(itemPage, item.link, customLog))
        await itemPage.close()
      } catch (err) {
        log(chalk.redBright(err))
      }

      if (!attempting) {
        for (let i = 0; i < 10; i++) customLog(chalk.greenBright('COMPRADO'))

        let arrIndex = this.runningItems.find(it => it.link === item.link)
        if (arrIndex) this.runningItems[arrIndex] = { ...this.runningItems[arrIndex], bought: true }

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

  async createHeadlessPage() {
    const page = await this.browser.newPage()

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
