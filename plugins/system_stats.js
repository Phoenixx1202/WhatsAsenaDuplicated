/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
Developer & Co-Founder - Phaticusthiccy
*/

const Asena = require('../events');
const {MessageType} = require('@adiwajshing/baileys');
const {spawnSync} = require('child_process');
const Config = require('../config');
const chalk = require('chalk');

const Language = require('../language');
const Lang = Language.getString('system_stats');


if (Config.WORKTYPE == 'private') {

    Asena.addCommand({pattern: 'status', fromMe: true, desc: Lang.STATUS_DESC}, (async (message, match) => {

        if (Config.STATUSMSG == 'default') {
            await message.client.sendMessage(message.jid,'```Tudo Funcionando!!```\n\n*Versão:* ```'+Config.VERSION+'```\n*Branch:* ```'+Config.BRANCH+'```\n*Site:* https://google.com' , MessageType.text);
        }
        else {
            await message.client.sendMessage(message.jid,Config.STATUSMSG + '\n*Powered by WhatsAsena*', MessageType.text);
        }
    }));

    Asena.addCommand({pattern: 'sysd', fromMe: true, desc: Lang.SYSD_DESC}, (async (message, match) => {

        const child = spawnSync('neofetch', ['--stdout']).stdout.toString('utf-8')
        await message.sendMessage(
            '```' + child + '```', MessageType.text
        );
    }));
}
else if (Config.WORKTYPE == 'public') {

    Asena.addCommand({pattern: 'status', fromMe: false, desc: Lang.STATUS_DESC}, (async (message, match) => {

        if (Config.STATUSMSG == 'default') {
            await message.client.sendMessage(message.jid,'```Tudo Funcionando!!```\n\n*Versão:* ```'+Config.VERSION+'```\n*Branch:* ```'+Config.BRANCH+'```\n*Site:* https://google.com' , MessageType.text);
        }
        else {
            await message.client.sendMessage(message.jid,Config.STATUSMSG + '\n**', MessageType.text);
        }
    }));

    Asena.addCommand({pattern: 'sysd', fromMe: false, desc: Lang.SYSD_DESC}, (async (message, match) => {

        const child = spawnSync('neofetch', ['--stdout']).stdout.toString('utf-8')
        await message.sendMessage(
            '```' + child + '```', MessageType.text
        );
    }));
}
