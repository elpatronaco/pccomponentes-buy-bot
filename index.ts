import { ICard } from './src/models'
import Bot from './src/app'

// credit/debit card info. This is not required, but be sure to have at least one card available in
// your account, or else the bot will fail at purchasing the product when it becomes available
let card: ICard = {
  name: 'AMADOR RIVAS',
  num: 54025187234213,
  expiryDate: 0925,
  cvc: 134
}

// initialize the bot class with personal data. Refresh rate is the rate in milliseconds that the bot
// will refresh the page till stock is available
const app = new Bot({
  email: 'amador@mariscosrecio.com',
  password: 'yoquese',
  card: card,
  link: 'https://www.pccomponentes.com/msi-rtx-3060-ti-ventus-2x-oc-8gb-gddr6',
  maxPrice: 440,
  refreshRate: 5000
})

app.run()
