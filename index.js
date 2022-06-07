const express = require('express');
const {Client, Intents} = require('discord.js')
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES]});
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

//alows bodyparser as express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.post('/sendDM', (req, res) => {
  let message = req.body.message;
  let id = req.body.id;
  client.on('ready', async()=>{
        try{
          await sendDM(message, id);
          res.send('The message was sent through discord');
        }catch(e){
          res.send('discord encountered an problem: '+e);
        }
    });
    try{
        sendDM(message, id);
        res.send('The message was sent through discord');
    }catch(e){
      res.send('discord encountered an problem: '+e);
    }
});

client.login(process.env.TOKEN);
app.listen(3000, () => console.log('Example app is listening on port 3000.'));