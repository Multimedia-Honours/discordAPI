const express = require('express');
const {Client, Intents} = require('discord.js')
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES]});
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
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

async function sendRyver(){
  
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

app.post('/sendMail', (req, res) => {

  /*
  expected request body:
  {
    toAddress:"",
    text:""
  }  
  */

  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rabbitholeMailSender@gmail.com',
        pass: process.env.PASSWORD
      }
  });

  var mailOptions = {
      from: 'rabbitholeMailSender@gmail.com',
      to: req.body.toAddress,
      subject: 'This message has been forwarded from the Rabbithole app',
      text: req.body.text
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.send({"statusCode":500, "body":error})
      } else {
        console.log('Email sent: ' + info.response);
        res.send({"statusCode":200, "body":"message send to email"})
      }
    });

});

client.login(process.env.TOKEN);
app.listen(3000, () => console.log('Example app is listening on port 3000.'));