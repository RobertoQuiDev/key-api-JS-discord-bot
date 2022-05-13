
config = require('./config.json');
const { info } = require('console');
const express = require("express");

var SelfReloadJSON = require('self-reload-json');
fs = require('fs')
db = new SelfReloadJSON('./db.json');
const app = express();
const keys = config.keys;

function isInThePast(date) {
  const today = new Date();

  return date < today;
}
function getNumberOfDays(end) {
  const date1 = new Date(Date.now());
  const date2 = new Date(end);
  const oneDay = 1000 * 60 * 60 * 24;
  const diffInTime = date2.getTime() - date1.getTime();
  const diffInDays = Math.round(diffInTime / oneDay);
  return diffInDays;
}
const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
function logsbot(bigmsg, msg) {
  if(config.bot.discord){
  const exampleEmbed = new MessageEmbed()
  .setColor(config.bot.logs.colors)
  .setTitle(bigmsg)
  .setURL(config.websiteURL)
  .setAuthor({ name: config.Productname, iconURL: config.bot.logs.ImageURL, url: config.websiteURL })
  .setDescription(msg)
  .setThumbnail(config.bot.logs.ImageURL)
  .setTimestamp()
  .setFooter({ text: config.Productname, iconURL: config.bot.logs.ImageURL });
  client.channels.cache.get(config.bot.logs.ChannelID).send({ embeds: [exampleEmbed] });
  }else{
    console.log(bigmsg)
    console.log(msg)
  }
}
if(config.bot.discord){
  //////////////////
try {
  
  client.once('ready', () => {
    client.user.setActivity(config.Productname, {type: 'PLAYING'})
    console.log('BOT STATUS: ON');

  });

  client.on("messageCreate",message=>{
    if (message.author.bot) return;
    const args=message.content.slice(6).trim().split(/ +/);
    const command=args.shift().toLowerCase()
    if(message.content.startsWith(config.bot.prefix + "add")){
      if(message.content.startsWith(config.bot.prefix)){if(!config.bot.owner.includes(message.author.id)) {return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')}}
      if (!args[0]) return message.reply('```' + config.bot.prefix + 'addkey  [Key] [DiscordID] [EndDate]("2022-01-25") [ServerIP] ``` missing key');
      if (!args[1]) return message.reply('```' + config.bot.prefix + 'addkey  '+ args[0] +' [DiscordID] [EndDate]("2022-01-25") [ServerIP]``` missing discord');
      if (!args[2]) return message.reply('```' + config.bot.prefix + 'addkey  ' + args[0] + ' ' + args[1] +' [DiscordID] [EndDate]("2022-01-25") [ServerIP]```missing date');
      if (!args[3]) return message.reply('```' + config.bot.prefix + 'addkey  ' + args[0] + ' ' + args[1] +' '+  args[2] +' [ServerIP]```missing server ip');
          let key = args[0];
          if(!db.keys[key]){db.keys[key] = []} 
          db.keys[key].push({
            DiscordID: args[1],
            time: args[2],
            srvip: args[3]
          })
          fs.writeFileSync('./db.json', JSON.stringify(db))
        message.channel.send(`[${key}] create succes for ip : ${args[3]} !`)
        try {
          const user = client.users.cache.get(args[1])
          user.send("Bonjour / Bonsoir <@"+ args[1] +">,\n\n```Votre Key : " + key + "\nDate De Fin " + args[2] + "\nIP Lock : " + args[3] + "```")
          message.channel.send(`<@${args[1]}> got dm the key info succes`)
        } catch (error) {
          message.channel.send(`<@${args[1]}> error when giving the key info in dm`)
          return
        }
    }
    if(message.content.startsWith(config.bot.prefix + "delkey")){
      if(message.content.startsWith(config.bot.prefix)){if(!config.bot.owner.includes(message.author.id)) {return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')}}
      if (!args[0]) return message.reply('```' + config.bot.prefix + 'delkey [Key]```');
          let key = args[0];
          if (db.keys[key]){ message.channel.send(`la Clee ${args[0]} a ete corectement suprimer!`); delete db.keys[key] }else{message.channel.send(`la Clee ${args[0]} a ete incorectement suprimer ou existe pas!`);}
          fs.writeFileSync('./db.json', JSON.stringify(db))
    }




    if(message.content.startsWith(config.bot.prefix + "keyinfo")){
      if(message.content.startsWith(config.bot.prefix)){if(!config.bot.owner.includes(message.author.id)) {return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')}}
      if (!args[0]) return message.reply('```' + config.bot.prefix + 'keyinfo [Key]```');
      let key = args[0];
      dsiahdjksnh = db.keys[key];
      let info = dsiahdjksnh[0];
      message.reply('```Server IP : '+ info.srvip +'\nKey End date : ' + info.time +'\nDay(s) Left : '+ getNumberOfDays(info.time) +'```Key Owner : <@'+ info.DiscordID +'>');
    }
    
        if(message.content.startsWith(config.bot.prefix + "ipreset")){
      if(message.content.startsWith(config.bot.prefix)){if(!config.bot.owner.includes(message.author.id)) {return message.channel.send('Vous n\'avez pas la permission d\'utiliser cette commande.')}}
      if (!args[0]) return message.reply('```' + config.bot.prefix + 'ipreset [Key] [NewIp]```');
      if (!args[1]) return message.reply('```' + config.bot.prefix + 'ipreset ' + args[0] +' [NewIp]```');
      let key = args[0];
      try {
      dsiahdjksnh = db.keys[key];
      let info = dsiahdjksnh[0];
      dsiahdjksnh[0].srvip = args[1];
      fs.writeFileSync('./db.json', JSON.stringify(db))
      message.reply('```New Server IP : '+ info.srvip +'```Key Owner : <@'+ info.DiscordID +'>`');
    } catch (error) {
      console.log('error key')
      message.reply('```ERROR KEY```');
    }
    }
    
    });
 client.login(config.bot.token);
 
} catch (error) {
  console.log('BOT STATUS: OFF [error]');
}
}else{console.log('BOT STATUS: OFF');}

  app.get("/", (req, res) => {
    {
      const hostip = req.connection.remoteAddress.split(':')[3];
      let { key, luckwork } = req.query;
      if(!key){
        return res.send('api v1.5 JS [1]')
      }else if(!luckwork){
        key = [];
        luckwork = [];
        return res.send('api v1.5 JS [2]')
      }else{
        if(!luckwork.includes("Roberto?8622")){
          logsbot("Wrong LuckWord❌"," ```❌ Detect Wrong Luckword \n\nKey used : " + key +" \nLuckwork used : " + luckwork +" \nsend from : "+ hostip + "```")
          key = [];
          luckwork = [];
          return res.send('api v1.5 JS [3]')
        }else if(!db.keys[key]){
          logsbot("Wrong Key❌"," ```❌ Detect Wrong Key \n\nKey used : " + key +" \nLuckwork used : " + luckwork +" \nsend from : "+ hostip + "```")
          key = [];
          luckwork = [];
          return res.send('Error: Key is Invalid!')
        }else{
                const jdsaojd = db.keys[key];
                const info = jdsaojd[0]
                if(!hostip.includes(info.srvip)){
                  logsbot("Wrong IP❌","```❌ [" + key  + "] \n\n"+ info.srvip + " try to connect whit " + hostip +"```Key Owner : <@" + info.DiscordID + ">")
                  key = [];
                  luckwork = [];
                  return res.send('api v1.5 JS [4]')
                }else if(isInThePast(new Date(info.time))){
                  logsbot("Expire❌","```❌ [" + key  + "] \n\nAction : has Expire \nEndDate : " + info.time + "```Key Owner : <@" + info.DiscordID + ">")
                  return res.send('api v1.5 JS [expire]')
                }else {
                  logsbot("GOOD :white_check_mark: ","```✔️ [" + key  + "] \n\nAction : has Loggin \nEndDate : " + info.time + "\nDay(s) left : " +getNumberOfDays(info.time) +"```Key Owner : <@" + info.DiscordID + ">")
                  return res.json({ DiscordID: info.DiscordID, inittime: info.time, svrip: hostip, messagejour: config.messagejour, dayleft: getNumberOfDays(info.time)})
                }
          }
      }
    }
  });
app.listen(config.portweb, () => console.log(`API listening on port : ${config.portweb}`));
