const qrcode = require('qrcode-terminal');
const gTTS = require('gtts');
const fs = require('fs');
const { Client, MessageMedia } = require('whatsapp-web.js');
const client = new Client();
const SESSION_FILE_PATH = './session.json';



client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
	if(msg.body === '!ping') {
		msg.reply('pong');
	}
	if (msg.body.startsWith("!r.p ")){
        let mensagem = msg.body.replace("!r.p ","")
		let speech = mensagem; 
        let gtts = new gTTS(speech, 'pt-br'); 
        
		gtts.save('Voice.mp3', function (err, result){ 
			if(err) { throw new Error(err); }
			try{
				client.sendMessage(msg.from, MessageMedia.fromFilePath(`./Voice.mp3`))
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
				client.sendMessage(msg.from, MessageMedia.fromFilePath(`./Rojers.mp3`))
			}
			catch(c){
				console.log(c)
			}
		});

	}
		

})

client.initialize()
