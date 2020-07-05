const Parser = require('rss-parser');
const Scraper = require('../scrapper_ss.js');

const parser = new Parser();

const feeds = [
    'https://www.ss.com/lv/real-estate/flats/riga/centre/sell/rss/',
];

class Feeder {
    async feed(callback) {
        for (const url of feeds) {
            await handleFeed(url, callback);
        }
    };
}

class Handler {
    constructor(item, callback) {
        this.item = item;
        this.callback = callback;
    }

    handleFeed() {
        let scrapper = new Scraper(this.item.link);
        this.imgUrls = [];

        scrapper.scrape((address) => {
            let url = new URL(address);

            if (url.origin === 'https://i.ss.com') {
                this.imgUrls.push(url.href);
            }
        });

        this.content = parseSScontentSnippet(this.item.contentSnippet);
        this.content.link = this.item.link;
        this.content.title = this.item.title;

        scrapper.on("end", () => {
            let distinctImgUrls = [...new Set(this.imgUrls)];

            this.callback({
                content: this.content,
                imageUrls: distinctImgUrls
            });
        });
    }
}

const handleFeed = async (feedUrl, callback) => {
    let feed = await parser.parseURL(feedUrl);

    let newItems = getNewItems(feed.items);

    for (let i = 0; i < newItems.length; i++) {
        const item = newItems[i];

        let handler = new Handler(item, callback);
        handler.handleFeed();
    }
}

const getNewItems = (items) => {
    const from = new Date();
    from.setHours(from.getHours() - 1);
    from.setMinutes(0);
    from.setSeconds(0);

    const newItems = [];

    for (const item of items) {
        const itemDate = new Date(item.isoDate);

        if (itemDate < from) {
            return newItems;
        }

        newItems.push(item);
    }

    return newItems;
};

const parseSScontentSnippet = (content) => {
    var splitted = content.split(/Iela:(.*?)Ist.:(.*?)m2:(.*?)Stāvs:(.*?)Sērija:(.*?):(.*?)Cena:(.*?)Apskatīt sludinājumu$/);

    return {
        street: splitted[1],
        rooms: splitted[2],
        area: splitted[3],
        floor: splitted[4],
        type: splitted[5],
        pricePerSquareMeter: splitted[6],
        price: splitted[7]
    };
};

module.exports = Feeder;