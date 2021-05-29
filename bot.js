/* Copyright (C) 2020 Yusuf Usta.

Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.

WhatsAsena - Yusuf Usta
*/

const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const Heroku = require('heroku-client');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./whatsasena/');
const { DataTypes } = require('sequelize');
const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');
const simpleGit = require('simple-git');
const git = simpleGit();

const heroku = new Heroku({
    token: config.HEROKU.API_KEY
});

let baseURI = '/apps/' + config.HEROKU.APP_NAME;

const Language = require('./language');
const Lang = Language.getString('updater');

// Sql
const WhatsAsenaDB = config.DATABASE.define('WhatsAsenaDuplicated', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');

// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

// ==================== Date Scanner ====================
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}
// ==================== End Date Scanner ====================

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function whatsAsena () {
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
    const conn = new WAConnection();
    const Session = new StringSession();

    conn.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    conn.on ('credentials-updated', async () => {
        console.log(
            chalk.blueBright.italic('✅ Informações de login atualizadas!')
        );

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('Whats')}${chalk.blue.bold('Asena')}
${chalk.white.bold('Versão:')} ${chalk.red.bold(config.VERSION)}

${chalk.blue.italic('ℹ️ Conectando ao WhatsApp... Aguarde.')}`);
    });
    

    conn.on('open', async () => {
        console.log(
            chalk.green.bold('✅ Login bem sucedido!')
        );

        console.log(
            chalk.blueBright.italic('⬇️ Instalando Plugins Externos...')
        );

        // ==================== External Plugins ====================
        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });
        // ==================== End External Plugins ====================

        console.log(
            chalk.blueBright.italic('⬇️  Instalando Plugins...')
        );

        // ==================== Internal Plugins ====================
        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });
        // ==================== End Internal Plugins ====================

        console.log(
            chalk.green.bold('✅ Plugins instalados!')
        );
        await new Promise(r => setTimeout(r, 1100));

        if (config.WORKTYPE == 'public') {
            if (config.LANG == 'TR' || config.LANG == 'AZ') {

                if (conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Lista negra detectada!```', MessageType.text)

                    await new Promise(r => setTimeout(r, 1700));

                    console.log('🛡️ Lista negra detectada 🛡️')

                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                
                else {
                    await conn.sendMessage(conn.user.jid, '*Bot em modo PÚBLICO!* \n\nNão teste os plug-ins aqui. \n\nEste é o seu número de LOG.\nVocê pode tentar comandos em qualquer chat :)_\n\nSeu bot funciona publicamente. \nPara alterá-lo, via config vars “WORK_TYPE” mude para “*private*”.\n\n', MessageType.text);

                    await git.fetch();
                    var commits = await git.log([config.BRANCH + '..origin/' + config.BRANCH]);
                    if (commits.total === 0) {
                        await conn.sendMessage(
                            conn.user.jid,
                            Lang.UPDATE, MessageType.text
                        );    
                    } else {
                        var degisiklikler = Lang.NEW_UPDATE;
                        commits['all'].map(
                            (commit) => {
                                degisiklikler += '🔸 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
                            }
                        );
        
                        await conn.sendMessage(
                            conn.user.jid,
                            '```Atualizar``` *.update now* ```Versão.```\n\n' + degisiklikler + '```', MessageType.text
                        ); 
                    }
                }
            }
            else {

                if (conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Lista negra detectada!```', MessageType.text)

                    await new Promise(r => setTimeout(r, 1800));

                    console.log('🛡️ Lista negra detectada 🛡️')
                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                
                else {
                    await conn.sendMessage(conn.user.jid, '*Bot em modo PÚBLICO!* \n\nNão teste plug-ins aqui. \n\nEste é o seu número de LOG._\nVocê pode testar comandos em qualquer chat :)\n\nRodando no modo PÚBLICO. \nPara mudar, vá até “WORK_TYPE” e troca “*_public_*” por “*_private_*”.\n\n**', MessageType.text);

                    await git.fetch();
                    var commits = await git.log([config.BRANCH + '..origin/' + config.BRANCH]);
                    if (commits.total === 0) {
                        await conn.sendMessage(
                            conn.user.jid,
                            Lang.UPDATE, MessageType.text
                        );    
                    } else {
                        var degisiklikler = Lang.NEW_UPDATE;
                        commits['all'].map(
                            (commit) => {
                                degisiklikler += '🔸 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
                            }
                        );
        
                        await conn.sendMessage(
                            conn.user.jid,
                            '```Envie``` *.update now* ```Para atualizar o bot.```\n\n' + degisiklikler + '```', MessageType.text
                        ); 
                    }
                }
            }
        }
        else if (config.WORKTYPE == 'private') {
            if (config.LANG == 'TR' || config.LANG == 'AZ') {

                if (conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === 't' || conn.user.jid === '') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Lista negra detectada!```', MessageType.text)

                    await new Promise(r => setTimeout(r, 1800));

                    console.log('🛡️ Lista negra detectada 🛡️')
                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                
                else {

                    await conn.sendMessage(conn.user.jid, '*Bot em modo PRIVADO!* \n\nNão teste os plug-ins aqui. \n\nEste é o seu número de LOG.\nVocê pode tentar comandos em qualquer chat :)_\n\nSeu bot funciona exclusivamente para você. \n\nPara alterá-lo, via config vars *“WORK_TYPE”* sua chave “public” faça isso.\n\n**', MessageType.text);

                    await git.fetch();
                    var commits = await git.log([config.BRANCH + '..origin/' + config.BRANCH]);
                    if (commits.total === 0) {
                        await conn.sendMessage(
                            conn.user.jid,
                            Lang.UPDATE, MessageType.text
                        );    
                    } else {
                        var degisiklikler = Lang.NEW_UPDATE;
                        commits['all'].map(
                            (commit) => {
                                degisiklikler += '🔸 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
                            }
                        );
        
                        await conn.sendMessage(
                            conn.user.jid,
                            '```Atualizar``` *.update now* ```Versão.```\n\n' + degisiklikler + '```', MessageType.text
                        ); 
                    }
                }
            }
            else {

                if (conn.user.jid === 't' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '' || conn.user.jid === '') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Lista negra detectada!```', MessageType.text)
   
                    await new Promise(r => setTimeout(r, 1800));

                    console.log('🛡️ Lista negra detectada 🛡️')
                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                
                else {

                    await conn.sendMessage(conn.user.jid, '*Bot em modo PRIVADO!* \n\nNão teste os plug-ins aqui. \n\nEste é o seu número de LOG. \nVocê pode tentar comandos em qualquer chat \n\nSeu bot funciona exclusivamente para você. \n\nPara alterá-lo, via config vars *“WORK_TYPE”* mude para “public” \n\n', MessageType.text);

                    await git.fetch();
                    var commits = await git.log([config.BRANCH + '..origin/' + config.BRANCH]);
                    if (commits.total === 0) {
                        await conn.sendMessage(
                            conn.user.jid,
                            Lang.UPDATE, MessageType.text
                        );    
                    } else {
                        var degisiklikler = Lang.NEW_UPDATE;
                        commits['all'].map(
                            (commit) => {
                                degisiklikler += '🔸 [' + commit.date.substring(0, 10) + ']: ' + commit.message + ' <' + commit.author_name + '>\n';
                            }
                        );
        
                        await conn.sendMessage(
                            conn.user.jid,
                            '```Envie``` *.update now* ```Para ATUALIZAR.```\n\n' + degisiklikler + '```', MessageType.text
                        ); 
                    }
                }
            }
        }
        else if (config.WORKTYPE == ' private' || config.WORKTYPE == 'Private' || config.WORKTYPE == ' Private' || config.WORKTYPE == 'privaye' || config.WORKTYPE == ' privaye' || config.WORKTYPE == ' prigate' || config.WORKTYPE == 'prigate' || config.WORKTYPE == 'priavte' || config.WORKTYPE == ' priavte' || config.WORKTYPE == 'PRİVATE' || config.WORKTYPE == ' PRİVATE' || config.WORKTYPE == 'PRIVATE' || config.WORKTYPE == ' PRIVATE') {

            if (config.LANG == 'TR' || config.LANG == 'AZ') {

                await conn.sendMessage(
                    conn.user.jid,
                    '_Parece que você deseja alternar para o modo privado! Desculpe_ *WORK_TYPE* _Sua chave está errada!_ \n_Não se preocupe! Estou tentando encontrar o certo para você.._', MessageType.text
                );

                await heroku.patch(baseURI + '/config-vars', {
                    body: {
                        ['WORK_TYPE']: 'private'
                    }
                })
            }
            else {

                await conn.sendMessage(
                    conn.user.jid,
                    '_Parece que você deseja alternar para o modo privado! Desculpe_ *WORK_TYPE* _Sua chave está errada!_ \n_Não se preocupe! Estou tentando encontrar o certo para você.._', MessageType.text
                );

                await heroku.patch(baseURI + '/config-vars', {
                    body: {
                        ['WORK_TYPE']: 'private'
                    }
                })
            }
        }
        else if (config.WORKTYPE == ' public' || config.WORKTYPE == 'Public' || config.WORKTYPE == ' Public' || config.WORKTYPE == 'publoc' || config.WORKTYPE == ' Publoc' || config.WORKTYPE == 'pubcli' || config.WORKTYPE == ' pubcli' || config.WORKTYPE == 'PUBLİC' || config.WORKTYPE == ' PUBLİC' || config.WORKTYPE == 'PUBLIC' || config.WORKTYPE == ' PUBLIC' || config.WORKTYPE == 'puvlic' || config.WORKTYPE == ' puvlic' || config.WORKTYPE == 'Puvlic' || config.WORKTYPE == ' Puvlic') {

            if (config.LANG == 'TR' || config.LANG == 'AZ') {

                await conn.sendMessage(
                    conn.user.jid,
                    '_Parece que você deseja alternar para o modo público! Desculpe seu_ *WORK_TYPE* _A chave está incorreta!_ \n_Não se preocupe! Estou tentando encontrar o caminho certo para você.._', MessageType.text
                );

                await heroku.patch(baseURI + '/config-vars', {
                    body: {
                        ['WORK_TYPE']: 'public'
                    }
                })
            }
            else {

                await conn.sendMessage(
                    conn.user.jid,
                    '_Parece que você deseja alternar para o modo público! Desculpe seu_ *WORK_TYPE* _A chave está incorreta!_ \n_Não se preocupe! Estou tentando encontrar o caminho certo para você.._', MessageType.text
                );

                await heroku.patch(baseURI + '/config-vars', {
                    body: {
                        ['WORK_TYPE']: 'public'
                    }
                })
            }
        }
        else {

            if (config.LANG == 'TR' || config.LANG == 'AZ') {

                return await conn.sendMessage(
                    conn.user.jid,
                    '_A_ *WORK_TYPE* _A chave que você digitou não foi encontrada_ \n_Por favor digite_ ```.setvar WORK_TYPE:private``` _Ou_ ```.setvar WORK_TYPE:public``` _Use o comando!_', MessageType.text
                );
            }
            else {

                return await conn.sendMessage(
                    conn.user.jid,
                    '_A_ *WORK_TYPE* _A chave que você digitou não foi encontrada!_ \n_Por favor digite_ ```.setvar WORK_TYPE:private``` _Ou_ ```.setvar WORK_TYPE:public```', MessageType.text
                );
            }
        }
    });

    
    conn.on('message-new', async msg => {
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

        if (config.NO_ONLINE) {
            await conn.updatePresence(msg.key.remoteJid, Presence.unavailable);
        }

        // ==================== Greetings ====================
        if (msg.messageStubType === 32 || msg.messageStubType === 28) {
            // Görüşürüz Mesajı
            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                await conn.sendMessage(msg.key.remoteJid, gb.message, MessageType.text);
            }
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
            // Mensagem de boas-vindas
            var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
                await conn.sendMessage(msg.key.remoteJid, gb.message, MessageType.text);
            }
            return;
        }
        // ==================== End Greetings ====================

        // ==================== Blocked Chats ====================
        if (config.BLOCKCHAT !== false) {     
            var abc = config.BLOCKCHAT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? abc.includes(msg.key.remoteJid.split('@')[0]) : abc.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        
        if (config.SUPPORT == '0') {     
            var sup = config.SUPPORT.split(',');                            
            if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
        }
        // ==================== End Blocked Chats ====================

        // ==================== Events ====================
        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = conn.chats.get(msg.key.remoteJid)
                        
                    if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                    if ((config.OWN == "905511384572,0" && msg.key.fromMe === false && command.fromMe === true &&
                        (msg.participant && config.OWN.includes(',') ? config.OWN.split(',').includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.OWN || config.OWN.includes(',') ? config.OWN.split(',').includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.OWN)
                    ) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                        if (command.onlyPinned && chat.pin === undefined) return;
                        if (!command.onlyPm === chat.jid.includes('-')) sendMsg = true;
                        else if (command.onlyGroup === chat.jid.includes('-')) sendMsg = true;
                    }
                    // ==================== End Events ====================

                    // ==================== Message Catcher ====================
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await conn.chatRead(msg.key.remoteJid);
                        }
                        
                        var match = text_msg.match(command.pattern);
                        
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(conn, msg);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && msg.message.videoMessage !== null) {
                            whats = new Video(conn, msg);
                        } else {
                            whats = new Message(conn, msg);
                        }

                        if (command.deleteCommand && msg.key.fromMe) {
                            await whats.delete(); 
                        }
                        // ==================== End Message Catcher ====================

                        // ==================== Error Message ====================
                        try {
                            await command.function(whats, match);
                        }
                        catch (error) {
                            
                            if (config.LANG == 'TR' || config.LANG == 'AZ') {
                                await conn.sendMessage(conn.user.jid, '*-- RELATÓRIO DE ERRO--*' + 
                                    '\n*Ocorreu um erro!*'+
                                    '\n_Este log de erros pode incluir seu número ou o número de um usuario, por favor, cuidado com isto!_' +
                                    '\n_Você pode escrever para o nosso grupo Telegram para obter ajuda._' +
                                    '\n_Esta mensagem deve ter ido para o seu número (mensagens gravadas)._' +
                                    '\n_O erro *Definir Grupo* Você pode encaminhar para este grupo._\n\n' +
                                    '*Real erro:* ```' + error + '```\n\n'
                                    , MessageType.text, {detectLinks: false});

                                if (error.message.includes('URL')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS ⚕️*' + 
                                        '\n========== ```Erro de Leitura!``` ==========' +
                                        '\n\n*Eu sou mesmo:* _Apenas URLs suportados_' +
                                        '\n*Razão:* _Ferramentas de mídia (xmedia, sticker..) LOG usar em número._' +
                                        '\n*Solução: * O comando pode ser usado em qualquer chat, exceto o número _LOG.._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('split')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Split of Undefined_' +
                                        '\n*Nedeni:* _Grup adminlerinin kullanabildiği komutların ara sıra split fonksiyonunu görememesi._ ' +
                                        '\n*Çözümü:* _Restart atmanız yeterli olacaktır._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('Ookla')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Ookla Server Connection_' +
                                        '\n*Nedeni:* _Speedtest verilerinin sunucuya iletilememesi._' +
                                        '\n*Çözümü:* _Bir kez daha kullanırsanız sorun çözülecektir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('params')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Requested Audio Params_' +
                                        '\n*Nedeni:* _TTS komutunun latin alfabesi dışında kullanılması._' +
                                        '\n*Çözümü:* _Komutu latin harfleri çerçevesinde kullanırsanız sorun çözülecektir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unlink')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _No Such File or Directory_' +
                                        '\n*Nedeni:* _Pluginin yanlış kodlanması._' +
                                        '\n*Çözümü:* _Lütfen plugininin kodlarını kontrol edin._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('404')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Error 404 HTTPS_' +
                                        '\n*Nedeni:* _Heroku plugini altındaki komutların kullanılması sonucu sunucu ile iletişime geçilememesi._' +
                                        '\n*Çözümü:* _Biraz bekleyip tekrar deneyin. Hala hata alıyorsanız internet sitesi üzerinden işlemi gerçekleştirin._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('reply.delete')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Reply Delete Function_' +
                                        '\n*Nedeni:* _IMG yada Wiki komutlarının kullanılması._' +
                                        '\n*Çözümü:* _Bu hatanın çözümü yoktur. Önemli bir hata değildir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('load.delete')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Reply Delete Function_' +
                                        '\n*Nedeni:* _IMG yada Wiki komutlarının kullanılması._' +
                                        '\n*Çözümü:* _Bu hatanın çözümü yoktur. Önemli bir hata değildir._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('400')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Bailyes Action Error_ ' +
                                        '\n*Nedeni:* _Tam nedeni bilinmiyor. Birden fazla seçenek bu hatayı tetiklemiş olabilir._' +
                                        '\n*Çözümü:* _Bir kez daha kullanırsanız düzelebilir. Hata devam ediyorsa restart atmayı deneyebilirsiniz._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('decode')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Hata Okundu!``` ==========' +
                                        '\n\n*Ana Hata:* _Cannot Decode Text or Media_' +
                                        '\n*Nedeni:* _Pluginin yanlış kullanımı._' +
                                        '\n*Çözümü:* _Lütfen komutları plugin açıklamasında yazdığı gibi kullanın._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unescaped')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro de leitura!``` ==========' +
                                        '\n\n*Ana Hata:* _Word Character Usage_' +
                                        '\n*Nedeni:* _TTP, ATTP gibi komutların latin alfabesi dışında kullanılması._' +
                                        '\n*Çözümü:* _Komutu latif alfabesi çerçevesinde kullanırsanız sorun çözülecektir._'
                                        , MessageType.text
                                    );
                                }
                                else {
                                    return await conn.sendMessage(conn.user.jid, '*🙇🏻 Não consegui ler este erro! 🙇🏻*' +
                                        '\n_Daha fazla yardım için grubumuza yazabilirsiniz._'
                                        , MessageType.text
                                    );
                                }
                            }
                            else {
                                await conn.sendMessage(conn.user.jid, '*-RELATÓRIO DE ERROS [WHATSASENA]-*' + 
                                    '\n*Ocorreu um erro no WhatsAsena!*'+
                                    '\n_Este log de erros pode incluir seu número ou o número de um oponente. \nPor favor, cuidado com isto!' +
                                    '\n_Esta mensagem deveria ter ido para o seu número (mensagens salvas)._\n\n' +
                                    '*Erro:* ```' + error + '```\n\n'
                                    , MessageType.text, {detectLinks: false}
                                );
                                if (error.message.includes('URL')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Main Error:* _Only Absolutely URLs Supported_' +
                                        '\n*Reason:* _The usage of media tools (xmedia, sticker..) in the LOG number._' +
                                        '\n*Solution:* _You can use commands in any chat, except the LOG number._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('split')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Main Error:* _Split of Undefined_' +
                                        '\n*Reason:* _Commands that can be used by group admins occasionally dont see the split function._ ' +
                                        '\n*Solution:* _Restarting will be enough._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('Ookla')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Main Error:* _Ookla Server Connection_' +
                                        '\n*Reason:* _Speedtest data cannot be transmitted to the server._' +
                                        '\n*Solution:* _If you use it one more time the problem will be solved._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('params')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Main Error:* _Requested Audio Params_' +
                                        '\n*Reason:* _Using the TTS command outside the Latin alphabet._' +
                                        '\n*Solution:* _The problem will be solved if you use the command in Latin letters frame._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unlink')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro resolvido``` ==========' +
                                        '\n\n*Main Error:* _No Such File or Directory_' +
                                        '\n*Reason:* _Incorrect coding of the plugin._' +
                                        '\n*Solution:* _Please check the your plugin codes._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('404')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Erro Principal:* _Erro 404 HTTPS_' +
                                        '\n*Razão:* _Falha na comunicação com o servidor devido ao uso dos comandos do plugin Heroku._' +
                                        '\n*Solução:* _Espere um pouco e tente novamente, se você ainda receber o erro, execute o comando no site.._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('reply.delete')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Main Error:* _Reply Delete Function_' +
                                        '\n*Reason:* _Using IMG or Wiki commands._' +
                                        '\n*Solution:* _There is no solution for this error. It is not a fatal error._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('load.delete')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Main Error:* _Reply Delete Function_' +
                                        '\n*Reason:* _Using IMG or Wiki commands._' +
                                        '\n*Solution:* _There is no solution for this error. It is not a fatal error._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('400')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Main Error:* _Bailyes Action Error_ ' +
                                        '\n*Reason:* _The exact reason is unknown. More than one option may have triggered this error._' +
                                        '\n*Solution:* _If you use it again, it may improve. If the error continues, you can try to restart._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('decode')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS [WHATSASENA] ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Main Error:* _Cannot Decode Text or Media_' +
                                        '\n*Reason:* _Incorrect use of the plug._' +
                                        '\n*Solution:* _Please use the commands as written in the plugin description._'
                                        , MessageType.text
                                    );
                                }
                                else if (error.message.includes('unescaped')) {
                                    return await conn.sendMessage(conn.user.jid, '*⚕️ RESOLUÇÃO DE ERROS ⚕️*' + 
                                        '\n========== ```Erro resolvido!``` ==========' +
                                        '\n\n*Erro Principal:* _Word Character Usage_' +
                                        '\n*Razão:* _Usando comandos como TTP, ATTP fora do alfabeto latino._' +
                                        '\n*Solução:* _O problema será resolvido se você usar o comando em alfabeto latino.._'
                                        , MessageType.text
                                    );
                                }
                                else {
                                    return await conn.sendMessage(conn.user.jid, '*🙇🏻 Não consegui ler este erro! 🙇🏻*' +
                                        '\n_You can write to our support group for more help._'
                                        , MessageType.text
                                    );
                                }    
                            }                      
                        }
                    }
                }
            }
        )
    });
    // ==================== End Error Message ====================

    try {
        await conn.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('A string da sua versão antiga está sendo renovada...'))
            conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await conn.connect();
            } catch {
                return;
            }
        }
    }
}

whatsAsena();
