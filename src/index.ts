import { ICard } from './models'
import Bot from './app'

// credit/debit card info. This is not required, if you don't provide it and you have no card on your account
// it will select bank transfer as payment
const card: ICard = {
  name: 'AMADOR RIVAS LOPEZ',
  num: '5137422665338597',
  expiryDate: '0421',
  cvc: '668'
}

// initialize the bot class with personal data.
const app = new Bot({
  email: 'amador@gmail.com',
  password: 'mariscosrecio',
  card: card,
  link:
    'https://www.pccomponentes.com/pccom-platinum-amd-ryzen-7-5800x-32gb-1tbssd-2tb-rx6800xt?gclid=Cj0KCQiA-OeBBhDiARIsADyBcE463GmlK4t8G5t-HQ7epqQxe0S1ftyPFO1zE7C8jT5zlxWDKJ_5SAoaArnnEALw_wcB&',
  maxPrice: 3000, // maxPrice is the maximum price you are willing to pay. If price goes above this the bot will not buy
  refreshRate: 1000, // rate in milliseconds that the bot will refresh the page till stock is available. Default: 1000 milliseconds (1 second)
  debug: true // SHOULD BE FALSE
})

app.run()
