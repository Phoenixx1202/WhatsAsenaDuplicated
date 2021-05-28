/* Codded by @phaticusthiccy
Telegram: t.me/phaticusthiccy
Instagram: www.instagram.com/kyrie.baran
*/

const Asena = require('../events');
const {MessageType, MessageOptions} = require('@adiwajshing/baileys');
const Config = require('../config');

// ==================== MAIN DESCRIPTION TEXT ====================
const h_Des = "Dá informações sobre como usar o bot no menu Ajuda."
const h_DedEN = "Dá informações sobre como usar o bot no menu Ajuda."
const matchnullEN = "====== *🆘 Ajuda Geral 🆘* ======\n\n🔘 *.alive:* \nVerifica se o bot está rodando.\n🔘 *.asena:* \nMostra a lista completa de comandos.\n🔘 *.setvar:* \nDefine a configuração sem entrar no Heroku.\n\n📌 \nPara obter mais ajuda, use o comando ```.*help* <o tópico para o qual você quer ajuda>```\n_Exemplo_: ```.*help* Como posso tornar público meu bot?```\n\n====== *Fim da Ajuda Geral* ======"
const matchnull = "====== *🆘 Ajuda Geral 🆘* ======\n\n🔘 *.alive:* \nVerifica se o bot está rodando.\n🔘 *.asena:* \nMostra a lista completa de comandos.\n🔘 *.setvar:* \nDefine a configuração sem entrar no Heroku.\n\n📌 \nPara obter mais ajuda, use o comando ```.*help* <o tópico para o qual você quer ajuda>```\n_Exemplo_: ```.*help* Como posso tornar público meu bot?```\n\n====== *Fim da Ajuda Geral* ======"
const notfound = "```A ajuda que você queria obter não foi encontrada!```\n```\nDescreva o problema de uma forma mais descritiva..```"
const notfoundEN = "```A ajuda que você queria obter não foi encontrada!```\n```Descreva o problema de uma forma mais descritiva..```"

// ==================== ALL DESCRİPTİONS ====================
const pubPT-BR = "Tornar seu bot público tornará os comandos públicos. \nDepois de tornado público, o usuário só pode usar comandos pessoais e administrativos. Fora isso, ele não pode usar comandos.\nPara tornar seu bot público *.setvar WORK_TYPE:public* usar o comando."
const pubPT-BR = "Tornar seu bot público tornará os comandos públicos. \nDepois de tornado público, o usuário só pode usar comandos pessoais e administrativos. Fora isso, ele não pode usar comandos.\nPara tornar seu bot público *.setvar WORK_TYPE:public* usar o comando."
const blPT-BR = "Fecha o bot BlockChat para um grupo, pessoa ou vários chats que você especificar.\nPara usá-lo, primeiro vá para o chat e *.jid* no verão. Vindo mais tarde *90xxx-xxx@g.us ou 90xxx@whatsapp.net* copie o texto. (@g.us e @whatsapp.net'eu silino!)\nArdından *.setvar BLOCK_CHAT:id && id1,id2...* komutunu kullanın."
const sudoTR = "SUDO, botunuzu seçtiğiniz kullanıcıya tüm yetkileri ile paylaşır. Numara sonuna ,0 koyarsanız gruplarda da aktif hale gelir.\nKullanmak için *.setvar SUDO:90xxxx && 90xx,90xxx [ülke kodu ile, (❌ +90xx • ✅ 90xx)]"

const privTR = "Botunuzu private yapmak komutları sadece size özel yapar. Başkaları kullanamaz.\nBotunuzu private yapmak için *.setvar WORK_TYPE:private* komutunu kullanın."
const privEN = "Making your bot private makes commands private only for you. Anyone cannot use.\nTo make your bot private, type *.setvar WORK_TYPE:private*"
const blEN = "Closes BlockChat bot to group, person or multiple chats you specify.\n To use it, first go to chat and type *.jid* Then copy to incoming code. (Except @g.us or @whatsapp.net!)\nThen use this command *.setvar BLOCK_CHAT:id && id1,id2..*"
const sudoPT-BR = "SUDO, compartilha seu bot com o usuário que você escolher com todos os seus poderes. Se você colocar 0 no final do número, o usuário também pode usá-lo no grupo.\nPara usar, digite *.setvar SUDO:90xxxx && 90xx,90xxx [com código de país/cidade, (❌ +90xx • ✅ 90xx)]*"

if (Config.LANG == 'TR' || Config.LANG == 'AZ') {
    
    Asena.addCommand({pattern: 'help ?(.*)', fromMe: true, desc: h_Des}, (async (message, match) => {

        if (match[1] === '') {
            return await message.client.sendMessage(
                message.jid,
                matchnull,
                MessageType.text
            );
        }
        else if ( (match[1].includes('public') && match[1].includes('nasıl')) || (match[1].includes('public') && match[1].includes('yapimi')) || (match[1].includes('public') && match[1].includes('yapımı')) || (match[1].includes('public') && match[1].includes('nedir')) || (match[1].includes('herkese') && match[1].includes('acik') || match[1].includes('açık')) ) {
            return await message.client.sendMessage(
                message.jid,
                pubTR,
                MessageType.text
            );
        }
        else if ( (match[1].includes('private') && match[1].includes('nasıl')) || (match[1].includes('private') && match[1].includes('yapimi')) || (match[1].includes('private') && match[1].includes('yapımı')) || (match[1].includes('private') && match[1].includes('nedir')) || (match[1].includes('bana') && match[1].includes('özel')) ) {
            return await message.client.sendMessage(
                message.jid,
                privTR,
                MessageType.text
            );
        }
        else if ( (match[1].includes('belirli') && match[1].includes('sohbet')) || (match[1].includes('sohbet') && match[1].includes('kapat')) || (match[1].includes('nasil') && match[1].includes('kapatabilirim')) || (match[1].includes('blockchat') && match[1].includes('nedir')) || (match[1].includes('sohbet') && match[1].includes('özel')) ) {
            return await message.client.sendMessage(
                message.jid,
                blTR,
                MessageType.text
            );
        }
        else if ( (match[1].includes('SUDO') && match[1].includes('nedir')) || (match[1].includes('SUDO') && match[1].includes('nasil')) || (match[1].includes('botu') && match[1].includes('baskasina')) || (match[1].includes('botu') && match[1].includes('arkadaşıma')) || (match[1].includes('SUDO') && match[1].includes('kullanmak')) ) {
            return await message.client.sendMessage(
                message.jid,
                sudoTR,
                MessageType.text
            );
        }
        else {
            return await message.client.sendMessage(
                message.jid,
                notfound,
                MessageType.text
            );
        }
    }));
}
else {
    
    Asena.addCommand({pattern: 'help ?(.*)', fromMe: true, desc: h_DedEN}, (async (message, match) => {

        if (match[1] === '') {
            return await message.client.sendMessage(
                message.jid,
                matchnullEN,
                MessageType.text
            );
        }
        else if ( (match[1].includes('public') && match[1].includes('how')) || (match[1].includes('public') && match[1].includes('set')) || (match[1].includes('public') && match[1].includes('setting')) ) {
            return await message.client.sendMessage(
                message.jid,
                pubEN,
                MessageType.text
            );
        }
        else if ( (match[1].includes('private') && match[1].includes('how')) || (match[1].includes('private') && match[1].includes('set')) || (match[1].includes('private') && match[1].includes('setting')) ) {
            return await message.client.sendMessage(
                message.jid,
                privEN,
                MessageType.text
            );
        }
        else if ( (match[1].includes('SUDO') && match[1].includes('usage')) || (match[1].includes('SUDO') && match[1].includes('what')) || (match[1].includes('how') && match[1].includes('SUDO')) || (match[1].includes('set') && match[1].includes('SUDO')) || (match[1].includes('share') && match[1].includes('bot')) ) {
            return await message.client.sendMessage(
                message.jid,
                sudoEN,
                MessageType.text
            );
        }
        else if ( (match[1].includes('block') && match[1].includes('chat')) || (match[1].includes('how') && match[1].includes('block')) || (match[1].includes('close') && match[1].includes('bot')) || (match[1].includes('specific') && match[1].includes('chat')) || (match[1].includes('specific') && match[1].includes('set')) ) {
            return await message.client.sendMessage(
                message.jid,
                blEN,
                MessageType.text
            );
        }
        else {
            return await message.client.sendMessage(
                message.jid,
                notfoundEN,
                MessageType.text
            );
        }
    }));
}
