const TelegramApi = require('node-telegram-bot-api')
const token = 'your token'
const bot = new TelegramApi(token, {polling: true})
const {gameOptions, repeatOptions} = require('./options')
const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(
        chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты - попробуй угадать её!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(
        chatId, 'Отгадывай!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Начать игру с угадыванием цифры'}
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id

        if(text === '/start') {
            await bot.sendSticker(
                chatId, 'https://tlgrm.ru/_/stickers/a6f/1ae/a6f1ae15-7c57-3212-8269-f1a0231ad8c2/21.webp')
            return bot.sendMessage(
                chatId, `Добро пожаловать в телеграм бот, ${msg.from.first_name}`)
        }

        if (text === '/info') {
            return bot.sendMessage(
                chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)

        }
        if(text === '/game') {
            return startGame(chatId)
        }
        return bot.sendMessage(
            chatId, 'Я не понял тебя, попробуй еще раз.')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again') {
            return startGame(chatId)
        }
        if(data == chats[chatId]) {
            return await bot.sendMessage(
                chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, repeatOptions)
        } else {
            return await bot.sendMessage(
                chatId, `К сожалению, бот загадал цифру ${chats[chatId]}`, repeatOptions)
        }
    })
}

start()