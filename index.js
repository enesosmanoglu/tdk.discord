//process.setMaxListeners(Infinity);
const { Client, RichEmbed, Attachment } = require("discord.js");

const client = new Client();


//const process = require("./config.json");

// Get bot version
try{
	var botVersion = require('./package.json').version;
}catch(err) {
	if(err) {
		console.error(new Error('Package.json not found'));
		var botVersion = "#?";
	}	
}

function ltrim(str) {
  if(str == null) return str;
  return str.replace(/^\s+/g, '');
}
function rtrim(str) {
  if(str == null) return str;
  return str.replace(/\s+$/g, '');
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '0x';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

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
const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

  
client.on("ready", async () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`/komutlar        |       v` + botVersion + `          `, {type: `STREAMING`});
    // PLAYING, STREAMING, LISTENING, WATCHING
  });


client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  //client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  //client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("message", async message => {
  if(message.author.bot) return;

  var log = "#" + message.channel.name + " - " + message.author.username + ": " + message;
  
  console.log(log);
      
  if(message.content.indexOf(process.env.prefix) !== 0) return;
  
  const args = message.content.slice(process.env.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const sayMessage = args.join(" ");
  message.delete().catch(O_o=>{}); 
        
  let member = message.mentions.members.first() || message.guild.members.get(args[0]);
  
  switch(command) {
    case "köken":
      const mesKOKEN = await message.reply("**" + sayMessage + "**\n*Sonuçlar yükleniyor...*");
          
      try {
        var request = require("request");

        request({
          uri: encodeURI("http://sozluk.gov.tr/gts?ara=" + sayMessage),
          encoding: 'utf8',
          jar: true
        }, function(error, response, body) {
          var dat = JSON.parse(body);

          var koken = "Bulunamadı!";

          try {
            koken = dat[0].lisan;
          } catch (error) {
            console.log(message.author.username + " => " + sayMessage + " (köken)    **SONUÇ YOK**");
            return mesKOKEN.delete();
          }
    
          const embed = new RichEmbed()
            .setAuthor(sayMessage + " (köken)", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/T%C3%BCrk_Dil_Kurumu_logo.png/600px-T%C3%BCrk_Dil_Kurumu_logo.png")
            .setColor(getRandomColor())
            .setFooter(message.author.username, message.author.avatarURL)
            .setTimestamp()
            .setDescription(koken == "" ? "=> Türkçe" : "=> " + koken)
                      
          console.log(message.author.username + " => " + sayMessage + "  (köken)") 
          
          mesKOKEN.delete();
          message.channel.send(embed);
    
        });
    
      } catch(err) {
        mesKOKEN.edit(`${message.author}, sonuçlar aranırken hata meydana geldi. Lütfen tekrar deneyiniz!`);
      }
      break;

    case "tdk":
      const mesTDK = await message.reply("**" + sayMessage + "**\n*Sonuçlar yükleniyor...*");
      
      try {
        var request = require("request");

        request({
          uri: encodeURI("http://sozluk.gov.tr/gts?ara=" + sayMessage),
          encoding: 'utf8',
          jar: true
        }, function(error, response, body) {
          var dat = JSON.parse(body);
        
          var toplu = JSON.stringify(dat);
    
          //console.log(dat[0]);
    
          var anlamlar = [];

          try {
            var a = dat[0].anlamlarListe;
          } catch (error) {
            console.log(message.author.username + " => " + sayMessage + "    **SONUÇ YOK**");
            return mesTDK.delete();
          }

          var koken = "";

          try {
            koken = dat[0].lisan;
          } catch (error) {
            koken = "";
          }

          dat[0].anlamlarListe.forEach(element => {
            var anlam = element.anlam;

            var ekler = [];

            try {
              element.orneklerListe.forEach(element => {
                var ornek = element.ornek;
                var yazar = element.yazar[0].tam_adi;

                ekler.push('*"' + ornek + '" - ' + yazar + "*");
              });
            } catch (error) {
              ekler = [];
            }       

            if (ekler.length == 0) {
              anlamlar.push("**" + anlam + "**");                  
            } else {
              anlamlar.push("**" + anlam + "**\n    " + ekler.join("\n    "));
            }

          });
    
          const embed = new RichEmbed()
            .setAuthor(koken == "" ? sayMessage : sayMessage + " (" + koken + ")", "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/T%C3%BCrk_Dil_Kurumu_logo.png/600px-T%C3%BCrk_Dil_Kurumu_logo.png")
            .setColor(getRandomColor())
            .setFooter(message.author.username, message.author.avatarURL)
            .setTimestamp()
            .setDescription(" • " + anlamlar.join("\n • "))
            .setThumbnail("http://osmanyarisma.tr.ht/resim.php?q=" + sayMessage)
                      
          console.log(message.author.username + " => " + sayMessage);
          
          mesTDK.delete();
          message.channel.send(embed);
    
        });
    
      } catch(err) {

          mesTDK.edit(`${message.author}, sonuçlar aranırken hata meydana geldi. Lütfen tekrar deneyiniz!`);
      }
      break;
    case "komutlar":
      var fs = require("fs");
      fs.readFile('./komutlar.txt', function(err, buf) {
        var txt = buf.toString();
            const embed = new RichEmbed()
              .setTitle("BOT KOMUTLARI (/komutlar)")
              .setColor(0xFF0000)
              .setDescription(txt);
            message.channel.send(embed);
      });
      break;
    default:
      //const m = await message.reply("*Komut bulunamadı! Komutları görmek için =>* **/komutlar**");
      break;
  }
  
});

client.login(process.env.token);
