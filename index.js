const { Composer } = require('micro-bot');
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
bot.on('sticker', ({ reply }) => reply('👍'));

bot.command('subscribe', (ctx) => Commands.subscribe(ctx.update.message.chat.id, ctx.reply));
bot.command('unsubscribe', (ctx) => Commands.unsubscribe(ctx.update.message.chat.id, ctx.reply));
bot.command('force_feed_flats', ({ replyWithHTML, replyWithMediaGroup }) => Commands.forceFeedFlats(replyWithHTML, replyWithMediaGroup));

bot.command('podcasts', ({ reply }) => { reply('not implemented 😛') /* await PodcastFeeder.feed(reply) */ });

bot.command('test', ({ reply }) => {
    let msg = 'Welcome! 💪\nAvailable commands:';
    for (let cmd in Commands) {
        msg += `\n/${cmd}`; 
    }
    reply(msg);
});

module.exports = bot;
