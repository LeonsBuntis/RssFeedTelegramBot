const { tryAddChatId, tryRemoveChatId, getChatIds } = require('./pg_repo.js');
const PodcastFeeder = require('./feeders/podcastFeeder');
const { generateGallery, generateMsg } = require('./telegramFormatter.js');
const FlatFeeder = require('./feeders/flatFeeder');
var feeder = new FlatFeeder();

(async () => {
    let chatIds = await getChatIds();

    chatIds = chatIds.splice(0, 1);

    feeder.feed(({ content, imageUrls }) => {

        for (const { ChatId } of chatIds) {
            // console.log(`sending to -> ${ChatId}`);

            if (imageUrls.length > 1) {
                const gallery = generateGallery(content, imageUrls);

                // bot.sendMediaGroup(ChatId, gallery);
                console.log(`${ChatId} gallery -> ${gallery[0].caption}`);
            } else {
                const msg = generateMsg(content);

                console.log(`${ChatId} -> ${msg}`);

                // bot.sendMessage(ChatId, msg);
            }
        }
    }); 
})();