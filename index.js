const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_URL = process.env.TWILIO_URL;
const TWILIO_DIAL_PHONE = process.env.TWILIO_DIAL_PHONE;
const TWILIO_ACTIVE_NUMBER = process.env.TWILIO_ACTIVE_NUMBER;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(TELEGRAM_TOKEN, {
    webHook: true
});

function dialPhoneNumber(chat) {
    return client.calls
        .create({
            url: TWILIO_URL,
            to: TWILIO_DIAL_PHONE,
            from: TWILIO_ACTIVE_NUMBER
        })
        .then(() => bot.sendMessage(chat.id, 'The bollard has been lowered successfully'))
        .catch(() => bot.sendMessage(chat.id, 'Unable to connect to the bollard, try again, or connect with admin'));
}

exports.handler = async (data) => {
    try {
        console.log(data)
        const {message: {chat, from, text}} = data;
        switch (text) {
            case '/open': {
                await dialPhoneNumber(chat);
                break;
            }
            default: {
                await bot.sendMessage(chat.id, `Hello, ${from.first_name} use  /open`)
            }
        }
        return text;
    } catch (e) {
        console.error(e)
        return e;
    }
}
