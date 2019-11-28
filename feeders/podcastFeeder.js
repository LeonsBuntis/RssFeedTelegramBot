const Parser = require('rss-parser');
const parser = new Parser();

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


const feed = async (reply) => {
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
};

module.exports = { feed };