const { Composer } = require('micro-bot')
const Parser = require('rss-parser');

const parser = new Parser();
const bot = new Composer()

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Help message'))
bot.hears('hi', ({ reply }) => reply('Hello'))
bot.on('sticker', ({ reply }) => reply('👍'))

bot.hears('feed', async ({ reply }) => await readFeed(reply))

readFeed = async (reply) => {

    let url = 'https://feed.syntax.fm/rss';

    let feed = await parser.parseURL(url);
    console.log(feed.title);

    for (let i = 0; i < 3; i++) {
        const item = feed.items[i];
        
        console.log(item);
        const msg = item.title + ':' + item.link;
        reply(msg);
    }
}

module.exports = bot
