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

on the project folder. You need to edit the parameters in the index.ts file inside the src/ directory. You can set an array if you want to buy multiple items or only an item. Note that if you don't have a credit/debit card in your pccomponentes account you can add a card here so the bot will add it in the buying process, but it's not required. If you don't have a credit card in your account and you didn't provide one the bot will select bank transfer as default payment.

```javascript
const card: ICard = {
  name: 'AMADOR RIVAS LOPEZ',
  num: '5137422665338597',
  expiryDate: '0421',
  cvc: '668'
}

const app = new Bot({
  email: 'amador@gmail.com',
  password: 'mariscosrecio',
  card: card,
  // IF YOU WANT MULTIPLE ITEMS SET AN ARRAY
  items: [
    {
      link: 'https://www.pccomponentes.com/rtx-3060',
      maxPrice: 3000
    },
    {
      link: 'https://www.pccomponentes.com/rtx-3080-x-trio',
      maxPrice: 1000
    }
  ],
  // IF YOU ONLY WANT AN ITEM DO IT LIKE THIS
  items: {
    link: 'https://www.pccomponentes.com/rtx-3060',
    maxPrice: 3000
  },
  refreshRate: 1000,
  debug: false
})

app.run()
```

Finally run `npm start` and let it work
