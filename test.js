const { tryAddChatId, tryRemoveChatId, getChatIds } = require('./pg_repo.js');
const Feeder = require('./feeders/flatFeeder.js');
const format = require('./telegramFormatter.js');

var feeder = new Feeder();

feeder.feed((arg) => {
    let result = format(arg);
    console.log(result);
});

// tryRemoveChatId('123').then(_ => getChatIds().then(e => console.log(e)));


// const Scraper = require('./scrapper_ss.js');

// let sc = new Scraper('https://www.ss.com/msg/lv/real-estate/flats/riga/centre/eikjg.html');

// sc.scrape((img) => {
//     let url = new URL(img);

//     if (url.origin === 'https://i.ss.com') {
//         console.log(url.href);
//     }
// });