const Bot = require('./app')

// credit/debit card info. This is not required, if you don't provide it and you have no card on your account
// it will select bank transfer as payment
const card = {
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
  items:
    [{
      link:
        'https://www.pccomponentes.com/pccom-bronze-sp-intel-core-i5-9400f-8gb-480gbssd-gtx1050ti',
      maxPrice: 3000
    },
    {
      link: "https://www.pccomponentes.com/evga-geforce-rtx-3060-ti-xc-8gb-gddr6-reacondicionado",
      maxPrice: 4000
    }]
  ,
  refreshRate: 1000, // rate in milliseconds that the bot will refresh the page till stock is available. Default: 1000 milliseconds (1 second)
  debug: false // SHOULD BE FALSE
})

app.run()
