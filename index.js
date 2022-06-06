const express = require('express');
const {Client, Intents} = require('discord.js')
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES]});
require('dotenv').config();

const app = express();

async function sendDM(message, id){
  try{    
      let userObj = await client.users.fetch(id);
      await userObj.send(message);
  }catch(e){
      console.log('Error message for sending DM: '+e);
  }
}

app.get('/', (req, res) => {
    res.send('Successful response.');
  });

app.get('/sendDM', (req, res) => {
  client.on('ready', ()=>{
    try{
        sendDM(req.query.message, req.query.id);
      }catch(error){
          res.send('the error message: '+e);
      }
    });
  res.send('The message was sent through discord');
  client.login(process.env.TOKEN);
});

app.listen(3000, () => console.log('Example app is listening on port 3000.'));