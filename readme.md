# Buy bot

A small buying bot made in node so you can get the 3080 you're dying for. (_This could be outdated because of changes on the website. Pull requests are welcome_)

### Currently supported stores:

- **PCComponentes**
- **LDLC**
- **Coolmod**
- **Aussar** (being worked on)

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

### Timeout error on opening pages

If you find this error it may happen because the device it's being ran on isn't capable of loading all pages in the 30 seconds timespan limit. To solve this you can supply a custom timeout. You can disable it setting it to 0 or deleting it from the data.json file.

```json
{
  "timeout": 30000 // milliseconds
}
```

It is recommended to reduce the number of pages if the device isn't that capable, because it will slow down bot's overall process.
