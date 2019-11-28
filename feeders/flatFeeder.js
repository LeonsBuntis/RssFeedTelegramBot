const Parser = require('rss-parser');
const Scraper = require('../scrapper.js');

const parser = new Parser();

const feeds = [
    'https://www.ss.com/lv/real-estate/flats/riga/centre/sell/rss/',
];

const feed = async (reply, replyGallery) => {
    feeds.forEach(async feedUrl => {
        let feed = await parser.parseURL(feedUrl);
        // console.log(feed);
        // console.log(feed.title);

        let newItems = getNewItems(feed.items);

        for (let i = 0; i < newItems.length; i++) {
            const item = newItems[i];

            let sc = new Scraper(item.link);
            let imgUrls = [];

            sc.scrape((img) => {
                if (img.extension !== '.jpg') {
                    return;
                }

                let url = new URL(img.address);
                // console.log(img);

                if (url.origin === 'https://i.ss.com') {
                    imgUrls.push(url.href);
                }
            });

            // console.log(item);

            var content = parseSScontentSnippet(item.contentSnippet);

            let msg = '<strong>';

            for (var key in content) {
                let value = content[key];
                let v = `${key}: ${value} \n`;
                // console.log(v);
                msg += v;
            }

            msg += '</strong>' + '\n' + item.title + '\n' + item.link;

            let msg2 = `${content.price} - ${content.type} ${content.street}\nrooms: ${content.rooms}, floor:${content.floor}\n${content.area} - ${content.pricePerSquareMeter}\n${item.link}`;

            sc.on("end", () => {
                let u = [...new Set(imgUrls)];
                let u2 = [];
                u.forEach(url => {
                    let inputMediaPhoto = {
                        type: 'photo',
                        media: url
                    };
                    u2.push(inputMediaPhoto);
                });

                if (u2.length > 1) {
                    let slicedPictures = u2.slice(0, 9);
                    slicedPictures[0].caption = msg2;

                    replyGallery(slicedPictures);
                } else {
                    reply(msg);
                }
            });
        }
    });
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
}

const parseSScontentSnippet = (content) => {
    var splitted = content.split(/Iela:(.*?)Ist.:(.*?)m2:(.*?)Stāvs:(.*?)Sērija:(.*?):(.*?)Cena:(.*?)Apskatīt sludinājumu$/);

    // console.log(splitted);

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

module.exports = { feed };