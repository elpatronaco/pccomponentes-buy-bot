const Telegram = require('node-telegram-bot-api')
const { getStoreName, isNumeric } = require('../utils')

module.exports = async function (chatId, botToken, app) {
  const bot = new Telegram(botToken, { polling: true })

  const sendMessage = async function (msg) {
    await bot.sendMessage(chatId, msg, { parse_mode: 'HTML' })
  }

  await bot.setMyCommands([
    { command: 'help', description: '❔ Show all commands' },
    { command: 'addproduct', description: '📲 Add product' },
    { command: 'seeproducts', description: '👀 See my products' }
  ])

  await sendMessage(
    'If you are seeing this message you have your Telegram Buy Bot successfully setup 🤓'
  )

  var answerCallbacks = {}

  bot.on('message', function (message) {
    console.log(message.text)
    var callback = answerCallbacks[message.chat.id]
    if (callback) {
      delete answerCallbacks[message.chat.id]
      return callback(message)
    }
  })

  bot.onText(/addproduct/, message => {
    bot.sendMessage(message.chat.id, 'Link of the product').then(function () {
      answerCallbacks[message.chat.id] = answer => {
        const link = answer.text
        bot
          .sendMessage(message.chat.id, 'Do you want to add a maximum price filter? (Number / N|n)')
          .then(function () {
            answerCallbacks[message.chat.id] = answer => {
              const maxPrice =
                answer.text && isNumeric(answer.text) ? Number(answer.text) : undefined
              const store = getStoreName(link, app.stores)

              let finalMsg

              if (store) {
                finalMsg = `Running item with link ${link} ${
                  maxPrice ? `and maximum price of ${maxPrice}€` : ''
                }`
                app.runItemInstance(store, { link: link, maxPrice: maxPrice })
              } else finalMsg = 'Link is invalid'

              bot.sendMessage(message.chat.id, finalMsg)
            }
          })
      }
    })
  })

  bot.onText(/seeproducts/, () => {
    if (app.runningItems && app.runningItems.length > 0) {
      app.runningItems.forEach(item => {
        sendMessage(
          `<i>${item.store}</i>: ${item.link} ${
            item.maxPrice ? `with maximum price of <b>${item.maxPrice}€</b>` : ''
          } ${item.bought ? 'and has already been bought' : "and isn't bought yet"}`
        )
      })
    } else {
      sendMessage(
        ':bangbang: There are no running items. Issue the command <b>/addproduct</b> to add one'
      )
    }
  })

  return {
    sendMessage
  }
}
