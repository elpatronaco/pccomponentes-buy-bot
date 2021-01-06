import { ICard } from './src/models'
import Bot from './src/app'

// credit/debit card info. This is not required, but be sure to have at least one card available in
// your account, or else the bot will fail at purchasing the product when it becomes available
const card: ICard = {
  name: 'AMADOR RIVAS LOPEZ',
  num: '5137422665338597',
  expiryDate: '0421',
  cvc: '668'
}

// initialize the bot class with personal data.
// refreshRate is the rate in milliseconds that the bot will refresh the page till stock is available. Default: 5000 milliseconds
// maxPrice is the maximum price you are willing to pay. If price goes above this the bot will not buy
// WARNING: Phone and credit card are unrequired fields. Delete them if you don't want to use them
const app = new Bot({
  email: 'ncxheth03e@safemail.icu',
  password: 'testpassword',
  phone: '+34612304123',
  card: card,
  link:
    'https://www.pccomponentes.com/asus-rog-strix-b450-f-gaming?gclid=CjwKCAiArbv_BRA8EiwAYGs23DIkRpeHU8hEGhBC39vLm7gGBywY7BNbjrupHHZIsejeMdpqWNEx8BoC3agQAvD_BwE&',
  maxPrice: 440,
  refreshRate: 8000
  debug: true
})

app.run()
