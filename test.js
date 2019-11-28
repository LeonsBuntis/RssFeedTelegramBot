const { tryAddChatId, tryRemoveChatId, getChatIds } = require('./pg_repo.js');

tryRemoveChatId('123').then(_ => getChatIds().then(e => console.log(e)))