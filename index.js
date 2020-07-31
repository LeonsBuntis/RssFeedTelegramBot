const { Composer, Stage, Scene, session } = require('micro-bot');
const Commands = require('./commands');

const bot = new Composer();

const commands = [
    '/subscribe - Subscribes you to SS.com flats feed',
    '/unsubscribe - Unsubscribes you from SS.com flats feed',
    '/force_feed_flats - Force feeds you last hours flats'
]

bot.start(({ reply }) => {
    let msg = 'Welcome! 💪\nAvailable commands:';
    for (let cmd of commands) {
        msg += `\n${cmd}`;
    }
    reply(msg);
});

bot.help((ctx) => ctx.reply('Help!'));

// Commands
bot.command('subscribe', (ctx) => Commands.subscribe(ctx.update.message.chat.id, ctx.reply));
bot.command('unsubscribe', (ctx) => Commands.unsubscribe(ctx.update.message.chat.id, ctx.reply));
bot.command('force_feed_flats', ({ reply }) => Commands.chooseInterval(reply));
// bot.command('podcasts', ({ reply }) => { reply('not implemented 😛') /* await PodcastFeeder.feed(reply) */ });

// Handlers
bot.on('callback_query', (ctx) => {
    ctx.editMessageReplyMarkup();

    Commands.forceFeedFlats(ctx.replyWithHTML, ctx.replyWithMediaGroup, ctx.update.callback_query.data);
});

module.exports = bot;
