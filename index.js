
config = require('./config.json');
const express = require("express");
var SelfReloadJSON = require('self-reload-json');
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
  app.get("/", (req, res) => {
    {
      let { key, luckwork } = req.query;
      if(!key){
        return res.send('api v1.5 JS [1]')
      }else if(!luckwork){
        key = [];
        luckwork = [];
        return res.send('api v1.5 JS [2]')
      }else{
        if(!luckwork.includes("Roberto?8622")){
          key = [];
          luckwork = [];
          return res.send('api v1.5 JS [3]')
        }else if(!db.keys[key]){
          key = [];
          luckwork = [];
          return res.send('Error: Key is Invalid!')
        }else{
                const info = db.keys[key];
                const hostip = req.connection.remoteAddress.split(':')[3];
                if(!hostip.includes(info.srvip)){
                  key = [];
                  luckwork = [];
                  return res.send('api v1.5 JS [4]')
                }else if(isInThePast(new Date(info.time))){
                  return res.send('api v1.5 JS [5]')
                }else {
                  return res.json({ DiscordID: info.DiscordID, inittime: info.time, svrip: hostip, messagejour: config.messagejour, dayleft: getNumberOfDays(info.time)})
                }
          }
      }
    }
  });
app.listen(config.portweb, () => console.log(`API listening on port : ${config.portweb}`));
