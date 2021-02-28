# PCComponentes buy bot

A small buying bot made in node for pccomponentes.com so you can get the 3080 you're dying for. (_This could be outdated because of changes on the website. Pull requests are welcome_)

### [en Español](https://github.com/elpatronaco/pccomponentes-buy-bot/blob/master/readme.es.md)

## How-to

A few things are needed for the bot to work. [Node installed](https://nodejs.org/es/download/) and the [chromedriver](https://chromedriver.chromium.org/getting-started) for the exact release of your chrome installation.

Open the console and type

```console
cd [directory of the project, e.g /usr/app/ or C://app]
```

Then install the node modules with the command

```console
npm install
```

on the project folder. You need to edit the parameters in the index.ts file inside the src/ directory. Note that if you don't have a credit/debit card in your pccomponentes account you can add a card here so the bot will add it in the buying process, but it's not required. If you don't have a credit card in your account and you didn't provide one the bot will select bank transfer as default payment.

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
  card: card,
  link: 'https://www.pccomponentes.com/msi-rtx-3060-ti-ventus-2x-oc-8gb-gddr6',
  maxPrice: 440,
  refreshRate: 5000
})

app.run()
```

Finally run `npm start` and let it work
