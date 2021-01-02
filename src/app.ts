import chromedriver from 'chromedriver'
import { ICard, IData } from './models'
import webdriver, { WebDriver, Builder, By, Key, Actions } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import fetch from 'node-fetch'

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build())

export default class Bot {
  email: string
  password: string
  link: string
  maxPrice?: number
  card?: ICard
  refreshRate?: number
  phone?: string

  constructor({ email, password, link, maxPrice, card, refreshRate, phone }: IData) {
    ;(this.email = email),
      (this.password = password),
      (this.link = link),
      (this.maxPrice = maxPrice),
      (this.card = card),
      (this.refreshRate = refreshRate),
      (this.phone = phone)
  }

  async run() {
    try {
      const driver = await new Builder().forBrowser('chrome').build()
      this.sleep(1000)
      await this.login(driver)
      await this.runItem(driver)
      await this.buyItem(driver)
    } catch (err) {
      console.error('ERROR NOT CAUGHT WHILE RUNNING BOT. MORE INFO BELOW')
      console.error(err)
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
          .then(value => value.sendKeys(this.email.trim()))
        await driver
          .findElement(By.css("input[data-cy='password'"))
          .then(value => value.sendKeys(this.password.trim(), Key.RETURN))
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
            .then(() => console.log(`Product is not yet in stock (${new Date().toUTCString()})`))
            .catch(async () => {
              await driver
                .findElement(By.id('precio-main'))
                .then(async value => (price = parseFloat(await value.getAttribute('data-price'))))
                .catch(() => console.error("Couldn't find item price"))
              // checks if current price is below max price before continuing
              if (
                this.maxPrice === undefined ||
                (price && this.maxPrice && price <= this.maxPrice)
              ) {
                stock = true
                console.log(`PRODUCT IN STOCK! Starting buy process`)
                this.sendSms('IN STOCK! ATTEMPTING TO BUY')
              } else {
                console.log(
                  `Price is above max. Max price set - ${this.maxPrice}€. Current price - ${price}€`
                )
              }
            })
          await this.sleep(this.refreshRate || 5000)
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
    // checks if the account has an added card, if not it adds he provided
    await driver.findElements(By.className('h5 card-name')).then(async value => {
      if ((await value[0].getAttribute('outerText')) === 'Nombre aquí')
        this.addCard !== undefined
          ? await this.addCard(driver)
          : console.error("Error: You have no card on you account and you didn't provide any")
    })
    await driver
      .findElements(By.className('c-indicator margin-top-0'))
      .then(value => value[0].click())
      .catch(reason => console.error(reason))
    await this.sleep(500)
    await driver
      .findElement(By.id('GTM-carrito-finalizarCompra'))
      .then(value => value.click())
      .catch(() => console.error("Couldn't click the buy button. FUUUUUCK"))
    for (var i = 0; i < 50; i++) console.log('COMPRADO')
    this.sendSms('DONE. CHECK YOUR ORDERS!')
  }

  async addCard(driver: WebDriver) {
    await this.sleep(200)
    // clicking add card button
    await driver
      .findElement(By.id('addNewCard'))
      .then(value => value.click())
      .catch(() => console.error("Didn't find the add card button"))
    await this.sleep(2000)
    const iFrames = await driver.findElements(By.className('js-iframe'))
    /* let values: Array<Array<[ By, number | string]>> = [
      [By.id('encryptedCardNumber'), this.card?.num!]
    ] */
    /* Card values are secured in 3 different IFrames, 
    we'll switch to each one and introduce the values */
    await driver.switchTo().frame(iFrames[0])
    await driver
      .findElement(By.id('encryptedCardNumber'))
      .then(value => value.sendKeys(parseInt(this.card?.num.trim()!, 10)))
    await driver.switchTo().defaultContent()
    //
    await driver.switchTo().frame(iFrames[1])
    await driver
      .findElement(By.id('encryptedExpiryDate'))
      .then(value => value.sendKeys(parseInt(this.card?.expiryDate.trim()!, 10)))
    await driver.switchTo().defaultContent()
    //
    await driver.switchTo().frame(iFrames[2])
    await driver
      .findElement(By.id('encryptedSecurityCode'))
      .then(value => value.sendKeys(parseInt(this.card?.cvc.trim()!, 10)))
    await driver.switchTo().defaultContent()
    //
    await driver
      .findElements(By.className('adyen-checkout__card__holderName__input'))
      .then(value => value[0].sendKeys(this.card?.name.trim()!))
    await this.sleep(500)
    //
    await driver
      .findElements(By.className('adyen-checkout__button adyen-checkout__button--pay'))
      .then(value => value[0].click())
    await this.sleep(500)
  }

  async sendSms(msg: string) {
    if (this.phone !== undefined)
      try {
        await fetch('https://rest-api.d7networks.com/secure/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic aWlheTMyMjI6elIyNDVRVGY='
          },
          body: JSON.stringify({
            // @ts-ignore
            content: msg,
            from: 'PCCOM-BOT',
            to: this.phone!
          })
        }).then(() => console.log(`SMS sent successfully: ${msg}`))
      } catch (err) {
        console.error(`Couldn't send SMS: ${err}`)
      }
  }

  async sleep(msec: number) {
    return new Promise(resolve => setTimeout(resolve, msec))
  }
}
