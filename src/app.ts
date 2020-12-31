import chromedriver from 'chromedriver'
import { ICard, IData } from './models'
import webdriver, { WebDriver, Builder, By, Key } from 'selenium-webdriver'
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
      await this.login(driver)
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
          .then(value => value.sendKeys(this.password, Key.RETURN))
        await this.sleep(3000)
        // await driver.findElement(By.css("button[data-cy='log-in']")).then(value => value.click())
      })
    console.log(`Successfully logged in as ${this.email}`)
  }

  async runItem(driver: WebDriver) {
    await driver
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
                .catch(() => console.error("Couldn't find item price"))
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
    await this.sleep(2000)
    // check if there is a cookies modal to accept
    await driver
      .findElement(By.className('btn btn-block btn-primary  btn-lg m-t-1 accept-cookie'))
      .then(value => value.click())
      .catch(() => console.log('No cookie accept button to click'))
    // clicks on buy button on product page
    await driver
      .findElement(By.xpath(`//*[@id="btnsWishAddBuy"]/button[3]`))
      .then(value => value.click())
      .catch(() => console.log("Couldn't find any buy button"))
    await this.sleep(3000)
    await driver.findElement(By.id('GTM-carrito-realizarPedidoPaso1')).then(value => value.click())
    await this.sleep(3000)
    await driver.findElements(By.className('h5 card-name')).then(async value => {
      if ((await value[0].getAttribute('outerText')) === 'Nombre aquí')
        this.addCard !== undefined
          ? await this.addCard(driver)
          : console.error("Error: You have no card on you account and you didn't provide any")
    })
    await driver
      .findElement(By.id('pccom-conditions'))
      .then(value => value.click())
      .catch(() => console.error("Didn't find the accept conditions button"))
    await this.sleep(500)
    await driver
      .findElement(By.id('GTM-carrito-finalizarCompra'))
      .then(value => value.click())
      .catch(() => console.error("Couldn't click the buy button. FUUUUUCK"))
    for (var i = 0; i < 50; i++) console.log('COMPRADO')
  }

  async addCard(driver: WebDriver) {
    // const scroll = document.scrollingElement || document.body
    // scroll.scrollTop = scroll.scrollHeight - 300
    await this.sleep(200)
    // clicking add card button
    await driver
      .findElement(By.id('addNewCard'))
      .then(value => value.click())
      .catch(() => console.error("Didn't find the add card button"))
    await this.sleep(500)
    await driver
      .findElement(By.id('encryptedCardNumber'))
      .then(value => value.sendKeys(this.card?.num!))
    await driver
      .findElement(By.id('encryptedExpiryDate'))
      .then(value => value.sendKeys(parseInt(this.card?.expiryDate!)))
    await driver
      .findElements(By.className('adyen-checkout__card__holderName__input'))
      .then(value => value[0].sendKeys(parseInt(this.card?.name!)))
    await this.sleep(200)
    await driver
      .findElements(By.className('adyen-checkout__button'))
      .then(value => value[0].click())
    await this.sleep(200)
    // scroll.scrollTop = 0
    await this.sleep(500)
  }

  async sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}
