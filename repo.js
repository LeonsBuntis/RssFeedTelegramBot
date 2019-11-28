const fs = require('fs');
const promises = fs.promises;

const fileName = './storage.json';

const getChatIds = async () => {
    try {
        let file = await promises.readFile(fileName, 'utf8');
        let chatIds = JSON.parse(file);
        return chatIds;
    } catch (error) {
        return [];
    }
};

const getChatIdsSync = () => {
    let file = fs.readFileSync(fileName, 'utf8');
    let chatIds = JSON.parse(file);
    return chatIds;
};

const tryAddChatId = async (chatId) => {
    const json = await getChatIds();
    const i = json.findIndex(c => c.chatId === chatId);

    if (i !== -1) {
        return false;
    }

    json.push({ chatId });
    await promises.writeFile(fileName, JSON.stringify(json));

    return true;
};

const tryRemoveChatId = async (chatId) => {
    try {
        const json = await getChatIds();

        const i = json.findIndex(c => c.chatId === chatId);
        json.splice(i, 1);
        await promises.writeFile(fileName, JSON.stringify(json));

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = { getChatIds, getChatIdsSync, tryAddChatId, tryRemoveChatId };