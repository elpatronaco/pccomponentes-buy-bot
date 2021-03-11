# Buy bot

A small buying bot made in node so you can get the 3080 you're dying for. (_This could be outdated because of changes on the website. Pull requests are welcome_)

### Currently supported stores:

- **PCComponentes**
- **LDLC**
- **Coolmod**

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

on the project folder. You need to edit the parameters in the data.json file inside the src/ directory.

```javascript
"pccomponentes": {
  "email": "amador@gmail.com",
  "password": "mariscosrecio",
  "items": [
    {
      "link": "https://www.pccomponentes.com/xiaomi-mi-computer-monitor-light-bar?gclid=Cj0KCQiAhP2BBhDdARIsAJEzXlFGPt39wcTtyjo0deaBkYmMFp7w0uHrSrSwFlMSCJzVJIUCZZYrQs0aAvfzEALw_wcB&",
      "maxPrice": 3000
    }
  ]
},
```

Finally run `npm start` and let it work
