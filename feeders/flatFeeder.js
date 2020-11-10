const Parser = require('rss-parser');
const Scraper = require('../scrapper_ss.js');
const moment = require('moment');

const parser = new Parser();

const feeds = [
    'https://www.ss.com/lv/real-estate/flats/riga/centre/sell/rss/',
];

class Feeder {
    constructor(from) {
        from = from ? from : 1;

        this.from = moment().subtract(from, 'hours');
        this.from.set('minute', 0);
        this.from.set('second', 0);
    }

    async feed(callback) {
        for (const url of feeds) {
            await this.handleFeed(url, callback);
        }
    };

    async handleFeed(feedUrl, callback) {
        let feed = await parser.parseURL(feedUrl);

        let newItems = this.getNewItems(feed.items);

        for (let i = 0; i < newItems.length; i++) {
            const item = newItems[i];

            let handler = new Handler(item, callback);
            setTimeout(() => {
                handler.handleFeed();
            }, 1000 * i);
        }
    }

    getNewItems(items) {
        const newItems = [];

        for (const item of items) {
            let mDate = moment(item.isoDate);
            let isDst = moment().isDST();
            if (!isDst) {
                mDate = mDate.add(1, 'hours');
            }

            if (this.from.isAfter(mDate)) {
                return newItems;
            }

            newItems.push(item);
        }

        return newItems;
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

        this.content = this.parseSScontentSnippet(this.item.contentSnippet);
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

    parseSScontentSnippet(content) {
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

}

module.exports = Feeder;