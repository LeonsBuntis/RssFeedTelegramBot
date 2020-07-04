const { tryAddChatId, tryRemoveChatId } = require('./pg_repo.js');
const PodcastFeeder = require('./feeders/podcastFeeder');
const { generateGallery, generateMsg } = require('./telegramFormatter.js');
const FlatFeeder = require('./feeders/flatFeeder');
var feeder = new FlatFeeder();

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

const forceFeedFlats = (reply, replyGallery) => {
    feeder.feed(({ content, imageUrls }) => {
        if (imageUrls.length > 1) {
            let gallery = generateGallery(content, imageUrls);

            return replyGallery(gallery);
        } else {
            let msg = generateMsg(content);

            return reply(msg);
        }
    });
};

module.exports = {
    subscribe,
    unsubscribe,
    forceFeedFlats
};