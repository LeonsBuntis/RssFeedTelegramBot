console.log(`Run job on -> ${new Date()}`);

const { Telegram } = require('micro-bot');
const FlatFeeder = require('./feeders/flatFeeder');
const { getChatIds } = require('./pg_repo.js');
const { generateGallery, generateMsg } = require('./telegramFormatter.js');
var feeder = new FlatFeeder();

const bot = new Telegram(process.env.BOT_TOKEN);

(async () => {
    let chatIds = await getChatIds();

    feeder.feed(({ content, imageUrls }) => {

        for (const { ChatId } of chatIds) {
            console.log(`sending to -> ${ChatId}`);

            if (imageUrls.length > 1) {
                let gallery = generateGallery(content, imageUrls);

                bot.sendMediaGroup(ChatId, gallery);
            } else {
                let msg = generateMsg(content);

                bot.sendMessage(ChatId, msg);
            }
        }
    });
})();