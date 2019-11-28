const { Client } = require('pg')

const withSql = async (query, values) => {
    const config = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    };

    const client = new Client(config)

    await client.connect()

    const res = await client.query(query, values)

    await client.end()

    return res.rows;
};

const getChatIds = async () => {
    try {
        let chatIds = await withSql('SELECT "ChatId" FROM public."Chats";');
        // console.log(chatIds);
        return chatIds;
    } catch (error) {
        return [];
    }
};

const tryAddChatId = async (chatId) => {
    try {
        const query = 'INSERT into public."Chats" values ($1);';
        await withSql(query, [chatId]);

        return true;
    } catch (error) {
        console.log(error.code);

        if (error.code == 23505) {
            // already exists
            return false;
        }
        
        throw error;
    }
};

const tryRemoveChatId = async (chatId) => {
    try {
        const query = 'delete from public."Chats" where "ChatId" = $1;';
        await withSql(query, [chatId]);

        return true;
    } catch (error) {
        return false;
    }
};

module.exports = { getChatIds, tryAddChatId, tryRemoveChatId };