const { tryAddChatId, tryRemoveChatId } = require('./pg_repo.js');
const FlatFeeder = require('./feeders/flatFeeder');
const PodcastFeeder = require('./feeders/podcastFeeder');

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

const forceFeedFlats = async ({ replyWithHTML, replyWithMediaGroup }) => await FlatFeeder.feed(replyWithHTML, replyWithMediaGroup);

module.exports = {
    subscribe,
    unsubscribe,
    forceFeedFlats
};