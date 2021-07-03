const gTTS = require('gtts');
const { Client, MessageMedia } = require('whatsapp-web.js');
const fs = require('fs');
const qrcode = require('qrcode-terminal')
var request = require("request");
const axios = require('axios');

const SESSION_FILE_PATH = './session.json';
let ws;
let dataSession;

const withSession = () => {
    dataSession = require(SESSION_FILE_PATH);
    ws = new Client({ session: dataSession });
    ws.on('ready', () => console.log('Cliente está pronto!'));
    ws.on('auth_failure', () => {
        console.log('** O erro de autenticação regenera o QRCODE (Excluir o arquivo session.json) **');
    })
    ws.initialize();
}
const withOutSession = () => {
    ws = new Client();
    // Geramos o QRCODE no Terminal
    ws.on('qr', qr => { qrcode.generate(qr, { small: true }); });
    ws.on('ready', () => console.log('Cliente está pronto!'));
    ws.on('auth_failure', () => {
        console.log('** O erro de autenticação regenera o QRCODE (Excluir o arquivo session.json) **');
    })
    // Se for autenticado, gera um arquivo com as variáveis  de sessão
    ws.on('authenticated', (session) => {
        dataSession = session;
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
            if (err) console.log(err);
        });
    });
    ws.initialize();
}

(fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession();


ws.on('message', msg => {
	if(msg.body === '!ping') {
		msg.reply('pong');
	}
	if (msg.body.startsWith("!r.f ")){
		let mensagem = msg.body.replace("!r.f ","")
		request('https://api.simsimi.net/v1/?text='+mensagem+'&lang=pt', function (error, response, body) {
			let jsonm = JSON.parse(body) 
			msg.reply(jsonm.success);
		});	

	}
	if (msg.body.startsWith("!r.p ")){
        let mensagem = msg.body.replace("!r.p ","")
		let speech = mensagem; 
        let gtts = new gTTS(speech, 'pt-br'); 
        
		gtts.save('Voice.mp3', function (err, result){ 
			if(err) { throw new Error(err); }
			try{
				ws.sendMessage(msg.from, MessageMedia.fromFilePath(`./Voice.mp3`))
			}
			catch(c){
				console.log(c)
			}
		}); 

	}
	if (msg.body.startsWith("!r.p.")){
        let mensagem = msg.body.replace("!r.p.","")
        lingua = mensagem.charAt(0) + mensagem.charAt(1)
        mensagem = mensagem.replace(lingua+" ", "")
        if (lingua == "ar" || lingua == "bg" || lingua == "ca" || lingua == "cs" || lingua == "da" || lingua == "de" || lingua == "el" || lingua == "en" || lingua == "eo" || lingua == "es" || lingua == "et" || lingua == "fa" || lingua == "fi" || lingua == "fr" || lingua == "ga" || lingua == "he" || lingua == "hi" || lingua == "hu" || lingua == "id" || lingua == "is" || lingua == "it" || lingua == "ja" || lingua == "ko" || lingua == "la" || lingua == "ml" || lingua == "ms" || lingua == "nl" || lingua == "no" || lingua == "pl" || lingua == "pt" || lingua == "rm" || lingua == "ro" || lingua == "ru" || lingua == "sk" || lingua == "sl" || lingua == "sr" || lingua == "sv" || lingua == "th" || lingua == "tl" || lingua == "tr" || lingua == "uk" || lingua == "uz" || lingua == "vi" || lingua == "zh"){
            var speech = mensagem; 
            var gtts = new gTTS(speech, lingua);
        } else {
            var speech = mensagem; 
            var gtts = new gTTS(speech, "pt-br");
        }
              
        gtts.save('Voice.mp3', function (err, result){ 
          if(err) { throw new Error(err); } 
		  	try{
				ws.sendMessage(msg.from, MessageMedia.fromFilePath(`./Voice.mp3`))
			}
			catch(c){
				console.log(c)
			}
		});

	}
	if (msg.body == "!piu") {
		axios({
		method: 'get',
		url: 'http://teles-jokes.azurewebsites.net/api/GetJoke?code=7skvGJHPnh6jOiZhwNKV0dL0awj9qTorLElJq596sKVHmrmgFJ6u4w==',
		  })
			.then(function (response) {
			  let body = response.data
			  ws.sendMessage(msg.from, body.joke.replace("||","\n"))
		});
	  }
	if (msg.body == '!rojers'){
		ws.sendMessage(msg.from, MessageMedia.fromFilePath(`./Rojers_image.jpeg`), { sendMediaAsSticker: true }) 
		ws.sendMessage(msg.from, MessageMedia.fromFilePath(`./Rojers.mp3`))
	}

})