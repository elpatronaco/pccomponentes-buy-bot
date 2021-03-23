const Telegram = require('node-telegram-bot-api')

module.exports = async function (chatId, botToken) {
  const bot = new Telegram(botToken, { polling: true })

  // await bot.setMyCommands([{ command: 'start', description: 'nidea' }])

  const sendMessage = async function (msg) {
    await bot.sendMessage(chatId, msg)
  }

  return {
    sendMessage
  }
}
