console.log(`Run job on -> ${new Date()}`);

const { Telegram } = require('micro-bot');
const FlatFeeder = require('./feeders/flatFeeder');
const { getChatIds } = require('./pg_repo.js');

const bot = new Telegram(process.env.BOT_TOKEN);

(async () => {
    let chatIds = await getChatIds();

    for (const { ChatId } of chatIds) {
        console.log(`sending to -> ${ChatId}`);

        FlatFeeder.feed((text) => bot.sendMessage(ChatId, text), (mediaGroup) => bot.sendMediaGroup(ChatId, mediaGroup));
    }
})();