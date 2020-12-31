import chromedriver from 'chromedriver'
import { Builder, By } from 'selenium-webdriver'
import { ICard, IData } from './models'
import webdriver, { WebDriver } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build())

export default class Bot {
  email: string
  password: string
  link: string
  maxPrice: number
  card?: ICard
  refreshRate: number

  constructor({ email, password, link, maxPrice, card, refreshRate }: IData) {
    ;(this.email = email),
      (this.password = password),
      (this.link = link),
      (this.maxPrice = maxPrice),
      (this.card = card),
      (this.refreshRate = refreshRate)
  }

  async run() {
    try {
      const driver = await new Builder().forBrowser('chrome').build()
      this.sleep(1000)
      //   await this.login(driver)
      await this.runItem(driver)
      await this.buyItem(driver)
    } catch (err) {
      console.error(err)
      stop()
    }
  }

  async login(driver: WebDriver) {
    await driver
      .navigate()
      .to('https://www.pccomponentes.com/login')
      .then(async () => {
        // this fills the form and logs in
        await driver
          .findElement(By.css("input[data-cy='email'"))
          .then(value => value.sendKeys(this.email))
        await driver
          .findElement(By.css("input[data-cy='password'"))
          .then(value => value.sendKeys(this.password))
        await driver.findElement(By.css("button[data-cy='log-in']")).then(value => value.click())
      })
    console.log(`Successfully logged in as ${this.email}`)
  }

  async runItem(driver: WebDriver) {
    driver
      .navigate()
      .to(this.link)
      .then(async () => {
        let stock: boolean = false
        let price: number | undefined
        // this loop will play till stock is available, then to the next step
        while (!stock) {
          await driver
            .navigate()
            .refresh()
            .catch(() => driver.navigate().to(this.link))
          await driver
            .findElement(By.id('notify-me'))
            .then(() => console.log('Product is not yet in stock'))
            .catch(async () => {
              await driver
                .findElement(By.id('precio-main'))
                .then(async value => (price = parseFloat(await value.getAttribute('data-price'))))
                .catch(() => console.log("Couldn't find item price"))
              // checks if current price is below max price before continuing
              if (price && price <= this.maxPrice) {
                stock = true
                console.log(`PRODUCT IN STOCK! Starting buy process`)
              } else {
                console.log(
                  `Price is above max. Max price set - ${this.maxPrice}€. Current price - ${
                    price || 'not defined'
                  }€`
                )
              }
            })
          this.sleep(this.refreshRate)
        }
      })
  }

  async buyItem(driver: WebDriver) {
    await driver
      .findElements(By.xpath('//*[@id="btnsWishAddBuy"]/button[3]'))
      .then(value => {
        console.log(value)
        value[0].click()
      })
      .catch(() => console.log("Couldn't find buy button"))
  }

  async sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}
