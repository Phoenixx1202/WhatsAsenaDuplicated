/* Codded by @phaticusthiccy
Telegram: t.me/phaticusthiccy
Instagram: www.instagram.com/kyrie.baran
*/

const Asena = require('../events');
const {MessageType,Mimetype} = require('@adiwajshing/baileys');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg'); // For Creating File
const {execFile} = require('child_process');
const cwebp = require('cwebp-bin');
const axios = require('axios'); // Resp Checker
const Config = require('../config'); // GAN STYLE Support

const got = require("got"); // Responses Catcher
const deepai = require('deepai'); // Localde ise deepmain.js oluşturarak özelleştirilebilir şekilde kullanabilirsiniz. Web Sunucularında Çalışmaz!!
deepai.setApiKey('3098e7e8-2590-436e-89b0-939da517c1f1'); // Quickstart API Key

const Language = require('../language'); 
const Lang = Language.getString('deepai'); // Language Support

if (Config.WORKTYPE == 'private') {

    Asena.addCommand({pattern: 'deepai', fromMe: true, deleteCommand: false, desc: Lang.DEEPAI_DESC}, (async (message, match) => {


        await message.sendMessage('💻 Usage: *.moodai <text>*\nℹ️ Desc: Ele encontra seu humor no artigo que você escreveu.\n\n💻 Usage: *.colorai*\nℹ️ Desc: Colori fotos em preto e branco.\n\n💻 Usage: *.faceai*\nℹ️ Desc: Gera rostos humanos que nunca existiram antes com inteligência artificial.\n\n💻 Usage: *.animai*\nℹ️ Desc: Gera rostos de anime que nunca existiram antes com inteligência artificial.\n\n💻 Usage: *.superai*\nℹ️ Desc: Melhora a qualidade das fotos com Neural AI.\n\n💻 Usage: *.waifuai*\nℹ️ Desc: Combina as paletas de cores das fotos com inteligência artificial.\n\n💻 Usage: *.dreamai*\nℹ️ Desc: Efeito de sonho profundo aplicado à foto.\n\n💻 Usage: *.neuraltalkai*\nℹ️ Desc: Explique o fenômeno da foto com inteligência artificial.\n\n💻 Usage: *.ttiai <text>*\nℹ️ Desc: Converte texto em uma imagem. (Text-to-Image)\n\n💻 Usage: *.toonai*\nℹ️ Desc: Transforma o rosto da foto em um personagem de desenho animado.\n\n💻 Usage: *.textai <text>*\nℹ️ Desc: Ele cria uma história artificial para você a partir de sua frase.\n\n💻 Usage: *.nudityai*\nℹ️ Desc: Mostra o valor NSFW entre 1 e 0 na foto.\n\n💻 Usage: *.ganstyle*\nℹ️ Desc: Combina a foto que você respondeu com a foto selecionada.\n\n⚠️ *Todas as ferramentas aqui funcionam com aprendizado profundo. \nQuanto mais você o usa, mais informações ele armazena.* ```Use apenas caracteres em inglês!```');

    }));
    Asena.addCommand({pattern: 'faceai', fromMe: true, deleteCommand: false, dontAddCommandList: true }, (async (message, match) => {

        var webimage = await axios.get('https://screenshotapi.net/api/v1/screenshot?url=https://thispersondoesnotexist.com/&output=image&width=1000&height=1000', { responseType: 'arraybuffer' })

        await message.sendMessage(Buffer.from(webimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

    }));

    Asena.addCommand({pattern: 'animai', fromMe: true, deleteCommand: false, dontAddCommandList: true }, (async (message, match) => {

        var min = 10000; 
        var max = 50000;  

        var asenasrandomgen = Math.floor(Math.random() * (+max - +min) + +min); 
        var IMGWADATA = await axios.get('https://screenshotapi.net/api/v1/screenshot?url=https://www.thiswaifudoesnotexist.net/example-' + asenasrandomgen + '.jpg&output=image&width=1000&height=1000', { responseType: 'arraybuffer' })

        await message.sendMessage(
            Buffer.from(IMGWADATA.data),
            MessageType.image, 
            {mimetype: Mimetype.jpg, caption: ''}
        )

    }));
    Asena.addCommand({pattern: 'colorai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Colorindo.. 🎨',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("colorizer", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'waifuai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {  
  
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Misturando.. 🧩',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("waifu2x", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'superai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {  
  
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Aprimorando.. 🖌️',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("torch-srgan", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'moodai ?(.*)', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {

        if (match[1] === '') return await message.sendMessage(Lang.TEXT);

        var resp = await deepai.callStandardApi("sentiment-analysis", {
            text: `${match[1]}`,

        });

        await message.reply(`*Mood:* ${resp.output}`);

    }));

    Asena.addCommand({pattern: 'dreamai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Noite estrelada.. 🌃',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("deepdream", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'neuraltalkai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Lendo.. 🙇🏻',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("neuraltalk", {
                    image: fs.createReadStream("./output.jpg"),

                });

                await message.reply(`*Output:* ${resp.output}`);

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'ttiai ?(.*)', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {

        if (match[1] === '') return await message.sendMessage(Lang.TEXT);

        var resp = await deepai.callStandardApi("text2img", {
            text: `${match[1]}`,

        });

        var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

        await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

    }));

    Asena.addCommand({pattern: 'toonai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Tooning.. 🌟',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("toonify", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'nudityai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {  
  
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Finding NSFW.. 🔥',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("content-moderation", {
                    image: fs.createReadStream("./output.jpg"),

                });

                await message.reply(`*Output:* ${resp.output.nsfw_score}`);

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'textai ?(.*)', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {

        if (match[1] === '') return await message.sendMessage(Lang.TEXT);

        var resp = await deepai.callStandardApi("text-generator", {
            text: `${match[1]}`,

        });

        await message.reply(`*Article:*\n ${resp.output}`);

    }));

    Asena.addCommand({pattern: 'ganstyle', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Criando.. ♻️',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("CNNMRF", {
                    style: Config.GANSTYLE,
                    content: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));
}
else if (Config.WORKTYPE == 'public') {

    Asena.addCommand({pattern: 'deepai', fromMe: false, deleteCommand: false, desc: Lang.DEEPAI_DESC}, (async (message, match) => {

        await message.sendMessage('💻 Usage: *.moodai <text>*\nℹ️ Desc: Ele encontra seu humor no artigo que você escreveu.\n\n💻 Usage: *.colorai*\nℹ️ Desc: Colori fotos em preto e branco.\n\n💻 Usage: *.faceai*\nℹ️ Desc: Gera rostos humanos que nunca existiram antes com inteligência artificial.\n\n💻 Usage: *.animai*\nℹ️ Desc: Gera rostos de anime que nunca existiram antes com inteligência artificial.\n\n💻 Usage: *.superai*\nℹ️ Desc: Melhora a qualidade das fotos com Neural AI.\n\n💻 Usage: *.waifuai*\nℹ️ Desc: Combina as paletas de cores das fotos com inteligência artificial.\n\n💻 Usage: *.dreamai*\nℹ️ Desc: Efeito de sonho profundo aplicado à foto.\n\n💻 Usage: *.neuraltalkai*\nℹ️ Desc: Explique o fenômeno da foto com inteligência artificial.\n\n💻 Usage: *.ttiai <text>*\nℹ️ Desc: Converte texto em uma imagem. (Text-to-Image)\n\n💻 Usage: *.toonai*\nℹ️ Desc: Transforma o rosto da foto em um personagem de desenho animado.\n\n💻 Usage: *.textai <text>*\nℹ️ Desc: Ele cria uma história artificial para você a partir de sua frase.\n\n💻 Usage: *.nudityai*\nℹ️ Desc: Mostra o valor NSFW entre 1 e 0 na foto.\n\n💻 Usage: *.ganstyle*\nℹ️ Desc: Combina a foto que você respondeu com a foto selecionada.\n\n⚠️ *Todas as ferramentas aqui funcionam com aprendizado profundo. \nQuanto mais você o usa, mais informações ele armazena.* ```Use apenas caracteres em inglês!```');

    }));

    Asena.addCommand({pattern: 'faceai', fromMe: false, deleteCommand: false, dontAddCommandList: true }, (async (message, match) => {

        var webimage = await axios.get('https://screenshotapi.net/api/v1/screenshot?url=https://thispersondoesnotexist.com/&output=image&width=1000&height=1000', { responseType: 'arraybuffer' })

        await message.sendMessage(Buffer.from(webimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

    }));

    Asena.addCommand({pattern: 'animai', fromMe: false, deleteCommand: false, dontAddCommandList: true }, (async (message, match) => {

        var min = 10000; 
        var max = 50000;  

        var asenasrandomgen = Math.floor(Math.random() * (+max - +min) + +min); 
        var IMGWADATA = await axios.get('https://screenshotapi.net/api/v1/screenshot?url=https://www.thiswaifudoesnotexist.net/example-' + asenasrandomgen + '.jpg&output=image&width=1000&height=1000', { responseType: 'arraybuffer' })

        await message.sendMessage(
            Buffer.from(IMGWADATA.data),
            MessageType.image, 
            {mimetype: Mimetype.jpg, caption: ''}
        )

    }));
    Asena.addCommand({pattern: 'faceai', fromMe: true, deleteCommand: false, dontAddCommandList: true }, (async (message, match) => {

        var webimage = await axios.get('https://screenshotapi.net/api/v1/screenshot?url=https://thispersondoesnotexist.com/&output=image&width=1000&height=1000', { responseType: 'arraybuffer' })

        await message.sendMessage(Buffer.from(webimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

    }));

    Asena.addCommand({pattern: 'animai', fromMe: true, deleteCommand: false, dontAddCommandList: true }, (async (message, match) => {

        var min = 10000; 
        var max = 50000;  

        var asenasrandomgen = Math.floor(Math.random() * (+max - +min) + +min); 
        var IMGWADATA = await axios.get('https://screenshotapi.net/api/v1/screenshot?url=https://www.thiswaifudoesnotexist.net/example-' + asenasrandomgen + '.jpg&output=image&width=1000&height=1000', { responseType: 'arraybuffer' })

        await message.sendMessage(
            Buffer.from(IMGWADATA.data),
            MessageType.image, 
            {mimetype: Mimetype.jpg, caption: ''}
        )

    }));
    Asena.addCommand({pattern: 'colorai', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Colorindo.. 🎨',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("colorizer", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'waifuai', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {  
  
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Misturando.. 🧩',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("waifu2x", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'superai', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Aprimorando.. 🖌️',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("torch-srgan", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'moodai ?(.*)', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {

        if (match[1] === '') return await message.sendMessage(Lang.TEXT);

        var resp = await deepai.callStandardApi("sentiment-analysis", {
            text: `${match[1]}`,

        });

        await message.reply(`*Mood:* ${resp.output}`);

    }));

    Asena.addCommand({pattern: 'dreamai', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Noite estrelada.. 🌃',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("deepdream", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'neuraltalkai', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Lendo.. 🙇🏻',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("neuraltalk", {
                    image: fs.createReadStream("./output.jpg"),

                });

                await message.reply(`*Output:* ${resp.output}`);

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'ttiai ?(.*)', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {

        if (match[1] === '') return await message.sendMessage(Lang.TEXT);

        var resp = await deepai.callStandardApi("text2img", {
            text: `${match[1]}`,

        });

        var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

        await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

    }));

    Asena.addCommand({pattern: 'toonai', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Tooning.. 🌟',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("toonify", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'nudityai', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Encontrando NSFW.. 🔥',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("content-moderation", {
                    image: fs.createReadStream("./output.jpg"),

                });

                await message.reply(`*Output:* ${resp.output.nsfw_score}`);

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'textai ?(.*)', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {

        if (match[1] === '') return await message.sendMessage(Lang.TEXT);

        var resp = await deepai.callStandardApi("text-generator", {
            text: `${match[1]}`,

        });

        await message.reply(`*Article:*\n ${resp.output}`);

    }));

    Asena.addCommand({pattern: 'ganstyle', fromMe: false, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Criando.. ♻️',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("CNNMRF", {
                    style: Config.GANSTYLE,
                    content: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));
    Asena.addCommand({pattern: 'deepai', fromMe: true, deleteCommand: false, desc: Lang.DEEPAI_DESC, dontAddCommandList: true}, (async (message, match) => {


        await message.sendMessage('💻 Usage: *.moodai <text>*\nℹ️ Desc: 🇹🇷 Yazdığınız yazıdan ruh halinizi bulur.\n🇬🇧 It finds your mood from the article you wrote.\n\n💻 Usage: *.colorai*\nℹ️ Desc: 🇹🇷 Siyah beyaz fotoğrafları renklendirir.\n🇬🇧 It colorize bw photos.\n\n💻 Usage: *.faceai*\nℹ️ Desc: 🇹🇷 Yapay zeka ile daha önce hiç var olmamış insan yüzleri üretir.\n🇬🇧 Generates human faces with artificial intelligence, that never existed before.\n\n💻 Usage: *.animai*\nℹ️ Desc: Yapay zeka ile daha önce hiç var olmayan anime yüzleri üretir.\n🇬🇧 Generates anime faces with artificial intelligence, that never existed before.\n\n💻 Usage: *.superai*\nℹ️ Desc: 🇹🇷 Fotoğrafın kalitesini yapay zeka ile arttırır.\n🇬🇧 Improves the quality of photos with Neural AI.\n\n💻 Usage: *.waifuai*\nℹ️ Desc: 🇹🇷 Fotoğrafların renk paletlerini yapay zeka ile birleştirir.\n🇬🇧 Combines the color palettes of photos with artificial intelligence.\n\n💻 Usage: *.dreamai*\nℹ️ Desc: 🇹🇷 Fotoğrafa deepdream efekti uygular.\n🇬🇧 Applies deepdream effect to the photo.\n\n💻 Usage: *.neuraltalkai*\nℹ️ Desc: 🇹🇷 Fotoğrafki olan şeyi yapay zeka ile açıklar.\n🇬🇧 Explain the phenomenon in the photo with artificial intelligence.\n\n💻 Usage: *.ttiai <text>*\nℹ️ Desc: 🇹🇷 Yazıyı resme dönüştürür.\n🇬🇧 Converts text to a picture. (Text-to-Image)\n\n💻 Usage: *.toonai*\nℹ️ Desc: 🇹🇷 Fotoğraftaki yüzü çizgi film karakterine çevirir.\n🇬🇧 Turns the face in the photo into a cartoon character.\n\n💻 Usage: *.textai <text>*\nℹ️ Desc: 🇹🇷 Yazdığınız cümleden size yapay bir hikaye yaratır.\n🇬🇧 It creates an artificial story for you from your sentence.\n\n💻 Usage: *.nudityai*\nℹ️ Desc: 🇹🇷 Fotoğraftaki NSFW değerini 1 ve 0 arasında gösterir. \n🇬🇧 It shows the NSFW value between 1 and 0 in the photo.\n\n💻 Usage: *.ganstyle*\nℹ️ Desc: 🇹🇷 Yanıtladığınız fotoğrafı seçili olan resim ile birleştirir.\n🇬🇧 Combines the photo you answered with the selected picture.\n\n⚠️ 🇹🇷 *Bütün bu yapay zeka araçlarını derin öğrenme ile çalışır. Ne kadar fazla kullanırsanız o kadar fazla bilgiyi depolar.* ```Sadece ingilizce karakter kullanın!```\n\n⚠️ 🇬🇧 *All the tools here work with deep learning. The more you use it, the more information it stores.* ```Use only english characters!```');

    }));

    Asena.addCommand({pattern: 'colorai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Colorindo.. 🎨',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("colorizer", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'waifuai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {  
  
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Misturando.. 🧩',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("waifu2x", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'superai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {  
  
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Aprimorando.. 🖌️',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("torch-srgan", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'moodai ?(.*)', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {

        if (match[1] === '') return await message.sendMessage(Lang.TEXT);

        var resp = await deepai.callStandardApi("sentiment-analysis", {
            text: `${match[1]}`,

        });

        await message.reply(`*Mood:* ${resp.output}`);

    }));

    Asena.addCommand({pattern: 'dreamai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {    

        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Noite estrelada.. 🌃',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("deepdream", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'neuraltalkai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Lendo.. 🙇🏻',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("neuraltalk", {
                    image: fs.createReadStream("./output.jpg"),

                });

                await message.reply(`*Output:* ${resp.output}`);

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'ttiai ?(.*)', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {

        if (match[1] === '') return await message.sendMessage(Lang.TEXT);

        var resp = await deepai.callStandardApi("text2img", {
            text: `${match[1]}`,

        });

        var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

        await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

    }));

    Asena.addCommand({pattern: 'toonai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Tooning.. 🌟',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("toonify", {
                    image: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'nudityai', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {  
  
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Encontrando NSFW.. 🔥',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("content-moderation", {
                    image: fs.createReadStream("./output.jpg"),

                });

                await message.reply(`*Output:* ${resp.output.nsfw_score}`);

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));

    Asena.addCommand({pattern: 'textai ?(.*)', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {

        if (match[1] === '') return await message.sendMessage(Lang.TEXT);

        var resp = await deepai.callStandardApi("text-generator", {
            text: `${match[1]}`,

        });

        await message.reply(`*Article:*\n ${resp.output}`);

    }));

    Asena.addCommand({pattern: 'ganstyle', fromMe: true, deleteCommand: false, dontAddCommandList: true}, (async (message, match) => {   
 
        if (message.reply_message === false) return await message.sendMessage('```Precisa de foto!```');

        var downloading = await message.client.sendMessage(message.jid,'Criando.. ♻️',MessageType.text);
        var location = await message.client.downloadAndSaveMediaMessage({
            key: {
                remoteJid: message.reply_message.jid,
                id: message.reply_message.id
            },
            message: message.reply_message.data.quotedMessage
        });

        ffmpeg(location)
            .save('output.jpg')
            .on('end', async () => {
                var resp = await deepai.callStandardApi("CNNMRF", {
                    style: Config.GANSTYLE,
                    content: fs.createReadStream("./output.jpg"),

                });

                var respoimage = await axios.get(`${resp.output_url}`, { responseType: 'arraybuffer' })

                await message.sendMessage(Buffer.from(respoimage.data), MessageType.image, {mimetype: Mimetype.jpg, caption: ''})

            });

            return await message.client.deleteMessage(message.jid, {id: downloading.key.id, remoteJid: message.jid, fromMe: true})

    }));
}
