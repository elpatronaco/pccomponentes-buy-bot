# Buy bot

## ‼️ Aviso: Está descontinuado. Aceptaré pull requests pero no arreglaré ni añadiré cosas.

**If you support my work you can donate here:**

[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg)](https://www.paypal.com/paypalme/paucolome)[![Donate](https://img.shields.io/badge/BitCoin-bc1q7dwjlknyvwv4s4hr7gmzje96awv5s47hys38xq-yellow)](https://link.trustwallet.com/send?coin=0&address=bc1q7dwjlknyvwv4s4hr7gmzje96awv5s47hys38xq)[![Donate](https://img.shields.io/badge/NANO-nano_3t6mahppbnjg43b3ri6z4ywt5hhtdkf9cpgnny19uonptg8a5sabkfgj4fw9-9cf)](https://link.trustwallet.com/send?coin=165&address=nano_3t6mahppbnjg43b3ri6z4ywt5hhtdkf9cpgnny19uonptg8a5sabkfgj4fw9)

A small buying bot made in node so you can get the 3080 you're dying for. (_This could be outdated because of changes on the website. Pull requests are welcome_)

:warning: **Disclaimer**: Use of this bot is neither legal nor illegal (at least in Spain). Be sure to check the laws in your country first. You are responsible for you own actions and should never blame maintainers/contributors.

### Currently supported stores:

- **PCComponentes**
- **LDLC**
- **Coolmod**
- **Aussar** (being worked on)
- **Amazon** [You need to have 1-Click set-up]

### [en Español](https://github.com/elpatronaco/pccomponentes-buy-bot/blob/master/readme.es.md)

## How-to

You need to have the latest version of Node installed. You can install it [here](https://nodejs.org/es/download/)

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

## Known errors

### Puppeteer on UNIX

If you are working with the bot on ARM architecture you possibly won't be able to work with the chromium build provided by puppeteer itself. To solve it you will need to install Chromium from an external source. You can do it with the default package manager on your UNIX flavour. By default, on Ubuntu/Debin you can do it like this:

```
sudo apt install chromium-browser
```

Once you have Chromium installed you will need to tell the bot where is it. You can check out the path of the installation with this command (on Ubuntu/Debian):

```
which chromium-browser
```

Once you've got Chromium's path (by default it's /usr/bin/chromium-browser), you need to add it in the headless section behind browserOptions on the file data.json. It looks like this:

```json
{
  "browserOptions": {
    "headless": {
      "headless": true,
      "defaultViewport": null,
      "executablePath": "/usr/bin/chromium-browser" // path
    },
    "debug": {
      "headless": false,
      "args": ["--start-maximized"],
      "defaultViewport": null
    }
  }
}
```

Bot should now work properly.
