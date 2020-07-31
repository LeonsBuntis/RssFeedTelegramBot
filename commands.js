const { tryAddChatId, tryRemoveChatId } = require('./pg_repo.js');
const PodcastFeeder = require('./feeders/podcastFeeder');
const { generateGallery, generateMsg } = require('./telegramFormatter.js');
const FlatFeeder = require('./feeders/flatFeeder');

const subscribe = async (chatId, reply) => {
    if (await tryAddChatId(chatId)) {
        reply('Subscribed! 💪');
    }
    else {
        reply('You are already subscribed! 🤘');
    }
};

const unsubscribe = async (chatId, reply) => {
    if (await tryRemoveChatId(chatId)) {
        reply('💩');
    }
    else {
        reply('something went wrong u\'re still subbed 💩');
    }
};

const forceFeedFlats = (reply, replyGallery, from) => {
    var feeder = new FlatFeeder(from);

    feeder.feed(({ content, imageUrls }) => {
        if (imageUrls.length > 1) {
            let gallery = generateGallery(content, imageUrls);
            
            replyGallery(gallery);
        } else {
            let msg = generateMsg(content);

            reply(msg);
        }
    });
};

const chooseInterval = (reply) => {
    return reply('Choose interval: ', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: '1h', callback_data: '1' },
                    { text: '2h', callback_data: '2' },
                    { text: '3h', callback_data: '3' },
                ],
                [
                    // { text: '1d', callback_data: '24' },
                ]
            ]
        }
    });
};

module.exports = {
    subscribe,
    unsubscribe,
    forceFeedFlats,
    chooseInterval
};