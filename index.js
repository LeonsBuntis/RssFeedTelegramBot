const { Composer } = require('micro-bot')
const Parser = require('rss-parser');

const parser = new Parser();
const bot = new Composer()

bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => ctx.reply('Help message'))
bot.hears('hi', ({ reply }) => reply('Hello'))
bot.on('sticker', ({ reply }) => reply('👍'))

bot.hears('feed', async ({ reply }) => setInterval(async () => await readFeed(reply), 10000))

const feeds = [
    "https://shoptalkshow.com/feed/podcast/",
    "https://weekly.bestofjs.org/rss/trends.xml",
    "https://feed.syntax.fm/rss",
    "https://davidwalsh.name/feed",
    "https://blog.codepen.io/feed/podcast/",
    "https://modernweb.podbean.com/feed.xml",
    "https://thewebplatform.libsyn.com/rss",
    "https://www.heavybit.com/category/library/podcasts/jamstack-radio/feed/",
    "https://feeds.soundcloud.com/users/soundcloud:users:206137365/sounds.rss",
    "https://rss.simplecast.com/podcasts/279/rss",
    "https://feeds.feedwrench.com/AdventuresInAngularOnly.rss",
    "https://feeds.feedwrench.com/AdventuresInDotNet.rss",
    "https://feeds.feedwrench.com/js-jabber.rss",
    "https://changelog.com/podcast/feed",
    "https://changelog.com/jsparty/feed",
    "https://feed.syntax.fm/rss"
];

readFeed = async (reply) => {
    feeds.forEach(async feedUrl => {
        let feed = await parser.parseURL(feedUrl);
        console.log(feed.title);

        for (let i = 0; i < 1; i++) {
            const item = feed.items[i];

            console.log(item);
            const msg = item.title + ':' + item.link;
            reply(msg);
        }
    });
}

module.exports = bot
