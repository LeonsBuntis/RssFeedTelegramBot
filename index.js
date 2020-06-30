const { Composer } = require('micro-bot');
const FlatFeeder = require('./feeders/flatFeeder');
const PodcastFeeder = require('./feeders/podcastFeeder');
const { getChatIds, tryAddChatId, tryRemoveChatId } = require('./pg_repo.js');

const bot = new Composer();

bot.start((ctx) => {
    const chatId = ctx.update.message.chat.id;

    if (await tryAddChatId(chatId)) {
        ctx.reply('Welcome, Subscribed! 💪');
    }
    else {
        ctx.reply('Welcome, You are already subscribed! 🤘');
    }
});

bot.help((ctx) => ctx.reply('Help message'));

bot.on('sticker', ({ reply }) => reply('👍'));

bot.hears('podcasts', async ({ reply }) => { reply('not implemented 😛') /* await PodcastFeeder.feed(reply) */});
bot.hears('f', async ({ replyWithHTML, replyWithMediaGroup }) => await FlatFeeder.feed(replyWithHTML, replyWithMediaGroup));

bot.hears('sub', async (ctx) => {
    const chatId = ctx.update.message.chat.id;

    if (await tryAddChatId(chatId)) {
        ctx.reply('Subscribed! 💪');
    }
    else {
        ctx.reply('You are already subscribed! 🤘');
    }
});

bot.hears('unsub', async (ctx) => {
    const chatId = ctx.update.message.chat.id;

    if (await tryRemoveChatId(chatId)) {
        ctx.reply('💩');
    }
    else {
        ctx.reply('something went wrong u\'re still subbed 💩');
    }
});

bot.hears('subscribers', async () => { 
    const chatIds = await getChatIds();
    console.log(chatIds);
});

module.exports = bot;
