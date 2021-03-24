const Telegram = require('node-telegram-bot-api')
const app = require('../index')
const { getStoreName, isNumeric } = require('../utils')

module.exports = async function (chatId, botToken) {
  const bot = new Telegram(botToken, { polling: true })

  const sendMessage = async function (msg) {
    await bot.sendMessage(chatId, msg)
  }

  await bot.setMyCommands([
    { command: 'addproduct', description: '📲 Add product' },
    { command: 'seeproducts', description: '👀 See my products' }
  ])

  await sendMessage('Send command /menu to start')

  var answerCallbacks = {}

  bot.on('message', function (message) {
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
              const store = getStoreName(link)

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
    app.runningItems.forEach(item => {
      console.log(item)
      sendMessage(
        `*${item.store}*: ${item.link} ${
          item.maxPrice ? `with maximum price of ${item.maxPrice}€}` : ''
        }`
      )
    })
  })

  return {
    sendMessage
  }
}
