const discord = require("discord.js");
const colours = require("./colours.json");
const bot = new discord.Client({
partials: ['MESSAGE', 'REACTION']
});
const fs = require('fs');
bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err)

    let jsfile = files.filter(f => f.split(".").pop() === "js") 
    if(jsfile.length <= 0) {
         return console.log("[LOGS] Couldn't Find Commands!");
    }

    jsfile.forEach((f, i) => {
        let pull = require(`./commands/${f}`);
        bot.commands.set(pull.config.name, pull);  
        pull.config.aliases.forEach(alias => {
            bot.aliases.set(alias, pull.config.name)
        });
    });
});



bot.on("message", async message => {
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = '&';
    let messageArray = message.content.split(" ")
    let cmd = messageArray[0].toLowerCase();
    let args = messageArray.slice(1);


    if(!message.content.startsWith(prefix)) return;
    let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.get(bot.aliases.get(cmd.slice(prefix.length)))
    if(commandfile) commandfile.run(bot,message,args)

});




bot.login('NzIyMjQ0MjU0MTI2MTc4MzI2.XugQfw.TDf5DQa7Yn2cecxmz5HsjgF3QzE')


bot.on('ready', () => {
    console.log(bot.user.tag + " aktif");
});


bot.on('guildMemberAdd', member => {

    let grole = member.guild.roles.cache.find(role => role.id === '722257309350494258');
    member.roles.add(grole);
    console.log('biri girdi');
    member.send("Welcome to the server!");
});


bot.on( 'messageReactionAdd', async (reaction, user)  => {

    let tanimla = async () => {
        let ismi = reaction.emoji.name;
        let grole = reaction.message.guild.roles.cache.find(role => role.id === '722257309350494258');
        let rol = reaction.message.guild.roles.cache.find(role => role.id === '722249440332742708');
        let member = reaction.message.guild.members.cache.find(member => member.id === user.id); 
    try {
        if(rol & grole & member)
            {
            await member.roles.add(rol);
            await member.roles.remove(grole);
            console.log('YAPTIM');
            }
        }
        catch(err){
            console.log(err);
        }
    }
    if(reaction.message.partial)
    {
    try {
        let msg = await reaction.message.fetch();
        if(msg.id === '723140354676883458')
        {
        tanimla();
        }
    }
    catch(err){
        console.log(err);
    }
}
else{
    console.log("taninmadi");
    if(reaction.message.id === '723140354676883458')
    {
    console.log(true)
    tanimla();
    }
}



});