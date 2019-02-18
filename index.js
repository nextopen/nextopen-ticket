const Discord = require("discord.js");
const fs = require("file-system");
const superagent = require("superagent");

const bot = new Discord.Client();

const pref = require("./preferences.json");

bot.on("error", console.error);

bot.on("ready", async ()=> {
  bot.user.setActivity("Tickets", {type: "LISTENING"});
  console.log(`Connecting with API...`);
  console.log(`[ Loading Stats ]`);
  console.log(`Members Total: ${bot.users.size}`);
  console.log(`Server Total: ${bot.guilds.size}`);
  console.log(`--------------------`);
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  if(message.content.indexOf(pref.prefix) !== 0) return;
  const args = message.content.slice(pref.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  const Author = message.author.username;
  const Message = args.join(" ");

 if(cmd === `t`){
   message.delete().catch(O_o=>{});

   if(args[0] === "new"){
     const ticketsubject = message.content.split(" ").slice(1).join(" ");
     var subject = args.join(" ").slice(4);
     if(!message.guild.roles.exists("name", "Support Officer")) return message.channel.send("Role `Support Officer` could not be found. Use `~t createSO` to create role.");
     if(message.guild.channels.exists("name", "ticket-" + message.author.username)) return message.channel.send("You already have an existing ticket. Please use that instead!");
     message.guild.createChannel(`ticket-${message.author.username}`, "text").then(ticket => {
     const supportRole = message.guild.roles.find("name", "Support Officer");
     const otherUsers = message.guild.roles.find("name", "@everyone");

     ticket.overwritePermissions(supportRole, {
       SEND_MESSAGES:true,
       READ_MESSAGES:true
     });

     ticket.overwritePermissions(otherUsers, {
       SEND_MESSAGES:false,
       READ_MESSAGES:false
     });

     ticket.overwritePermissions(message.author, {
       SEND_MESSAGES:true,
       READ_MESSAGES:true
     });
     var ticketMade = new Discord.RichEmbed()
     .setDescription(`Your ticket has been made! Click <#${ticket.id}>`)
     .setColor("#fff");
     message.channel.send(ticketMade);

     if(!subject){
       let subject = "No Subject.";
     }

     var ticketInMSG = new Discord.RichEmbed()
     .setTitle("Ticket Information")
     .setDescription(`Thank you for creating a ticket! Please wait for Support Officer to respond and help.\n\n**Subject**\n${subject}`)
     .setColor("#fff")
     .setThumbnail(bot.user.avatarURL);

    ticket.send(ticketInMSG);
   });
 }
   if(args[0] === "close"){
      if(!message.channel.name.startsWith(`ticket-`)) return message.reply("Must be in a ticket to close.");
      if(message.channel.name.startsWith(`ticket-`)) return message.channel.delete();
   }
   if(args[0] === "createSO"){
      message.guild.createRole({
        name: "Support Officer"
      });
      message.channel.send("Role Created!");

      if(message.guild.roles.exists("name", "Support Officer")) return message.reply("There is already a `Support Officer` role created.");
   }
 }
});

bot.login(pref.token);
