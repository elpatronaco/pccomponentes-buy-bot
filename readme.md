# PCComponentes buy bot

A small buying bot made in node for pccomponentes.com so you can get the 3080 you're dying for. (**This could be outdated because of changes on the website. Pull requests are welcome**)

### [en Español](https://github.com/elpatronaco/pccomponentes-buy-bot/blob/master/readme.es.md)

## How-to

A few things are needed for the bot to work. Node installed and the chromedriver for the release of your chrome installation (you can install it from [here](https://chromedriver.chromium.org/getting-started))

Install the node modules with the command `npm script` on the project folder. Then you need to edit the parameters in the index.ts file. Note that if you don't have a credit/debit card in your pccomponentes account you can add a card here so the bot will add it in the buying process, but it's not required. Also the script is able to send SMS to your phone with info about the process, if you don't want to, delete the phone from the parameters.

```javascript
const card: ICard = {
  name: 'AMADOR RIVAS LOPEZ',
  num: '5137422665338597',
  expiryDate: '0421',
  cvc: '668'
}

const app = new Bot({
  email: 'amador@mariscosrecio.com',
  password: 'yoquese',
  phone: '+34612304123',
  card: card,
  link: 'https://www.pccomponentes.com/msi-rtx-3060-ti-ventus-2x-oc-8gb-gddr6',
  maxPrice: 440,
  refreshRate: 5000
})

app.run()
```

Finally run `npm start` and let it work
