const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");


client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    let dlounge = client.guilds.find(guild => guild.name==="DarumaLounge")
    // let purgch = dlounge.channels.find(channel => channel.name === "purgatory")

    // purgch.fetchMessages().then(fetched=>{
    //     purgch.bulkDelete(fetched).catch(error => purgch.send([`Couldn't delete messages because of: ${error}`]));
    // })
    
     
    // purgch.send(["Welcome to purgatory, *Haha!  Hoho!*"
    //     ,"Speak to receive a trait.  Choose wisely, for you can only move in one direction."
    //     ,""
    //     ,"**\"halo\" (G)**: Join heaven as a precious angel where only happy thoughts are allowed."
    //     ,"   (Must not have *soul* or *horns*.)"
    //     ,"**\"soul\" (PG-13)**: Join the common folk in the land of lame jokes."
    //     ,"   (Must not have *horns* unless you also have a *halo*.)"
    //     ,"**\"horns\" (MA)**: Join the grown-ups in the land of degenerates."
    // ])
    client.user.setActivity(`Serving ${client.guilds.size} servers`);

    client.on("message", async message => {
        if (message.author.bot) return;
        if (message.content.indexOf('#19')>-1){
            return message.react(`😏`)
        }
    
        // if (message.channel.name === "purgatory") {
        //     message.delete().catch(O_o => {
        //         console.log('deletefail', O_o)
        //     });
            // let welcomeMessageId = false
            // if (message.content === "halo") {
            //     if (message.member.roles.some(r => ['soul', 'horns'].includes(r.name)))
            //         message.reply("Sorry, you can't have a halo!");
            //     var role = message.guild.roles.find(role => role.name === "halo");
            //     message.member.addRole(role).then(m => {
            //         m.reply("Welcome, sweet angel.").then(msg=>{msg.delete(5000)})
            //     }).catch(e => {
            //         if(welcomeMessageId) 
            //         message.reply("Failed to gain halo.").then(msg=>{msg.delete(5000)})
            //     });;
            // }
            // if (message.content === "soul") {
            //     if (message.member.roles.some(r => ['horns'].includes(r.name)))
            //         if(!message.member.roles.some(r => ['halo'].includes(r.name)))
            //             message.reply("Sorry, you can't have a soul.").then(msg=>{msg.delete(5000)});
            //     message.member.addRole(message.guild.roles.find(role => role.name === "soul")).then(m => {
            //         m.reply("Sup.").then(msg=>{msg.delete(5000)})
            //     }).catch(e => {
            //         message.reply("Failed to gain soul.").then(msg=>{msg.delete(5000)})
            //     });
            // }
            // if (message.content === "horns") {
            //     message.member.addRole(message.guild.roles.find(role => role.name === "horns")).then(m => {
            //         m.reply("Welcome to the jungle, baby!").then(msg=>{msg.delete(5000)})
            //     }).catch(e => {
            //         message.reply("Failed to gain horns.").then(msg=>{msg.delete(5000)})
            //     });;
            // }
        // }
    
        const prereg = new RegExp(config.prefix);
        let messageMatch = message.content.match(prereg);
        if (!messageMatch || messageMatch.length == 0) return
        const args = message.content.slice(messageMatch[0]).trim().split(/ +/g);
        args.shift();
        const command = args.shift().toLowerCase();
    
        if (command === "ping") {
            const m = await message.channel.send("Ping?");
            m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
        }
    
        if (command === "say") {
            //console.log('saycommand', message.author.id)
            //if(message.author.id !== "555509356637061136") return
            const sayMessage = args.join(" ");
            if(sayMessage.length > 200) return message.channel.send("lol tl;dr")
            message.delete().catch(O_o => {});
            message.channel.send(sayMessage);
        }

        if (command === "ascend") {
            if (!message.member.roles.some(r => config.modRoles.includes(r.name)))
                return message.reply("Sorry, you don't have permissions to use this!");
            const mbtag = args.shift()
            let halotarget = dlounge.members.find(mb=>mb.user.tag === mbtag)
            if(halotarget) halotarget.addRole(message.guild.roles.find(role => role.name === "halo")).then(m => {
                message.reply(`${halotarget.user.username} has been granted a halo.`)
            }).catch(e => {
                console.log('ascend err', e)
                message.reply(`${halotarget.user.username} could not be ascended.`).then(msg=>{msg.delete(5000)})
            })

        }
        if (command === "ensoul") {
            if (!message.member.roles.some(r => config.modRoles.includes(r.name)))
                return message.reply("Sorry, you don't have permissions to use this!");
            const member = args.shift()
            let soulTarget = dlounge.members.find(mb=>mb.id === member)
            soulTarget.addRole(message.guild.roles.find(role => role.name === "soul")).then(m => {
                message.reply(`${hornTarget.user.username} has been granted a soul.`).then(msg=>{
                    soulTarget.removeRole(dlounge.roles.find(role => role.name === 'halo')).then(ms => {
                        message.reply(`${hornTarget.user.username} has been banished from heaven.`)
                    }).catch(e => {
                        message.reply(`${hornTarget.user.username} had no halo.`).then(msg=>{msg.delete(5000)})
                    })
                })
            }).catch(e => {
                message.reply(`${hornTarget.user.username} could not be ensouled.`).then(msg=>{msg.delete(5000)})
            })

        }
        if (command === "damn") {
            if (!message.member.roles.some(r => config.modRoles.includes(r.name)))
                return message.reply("Sorry, you don't have permissions to use this!");
            const member = args.shift()
            let hornTarget = dlounge.members.find(mb=>mb.id === member)
            hornTarget.addRole(message.guild.roles.find(role => role.name === "horns")).then(x => {
                message.reply(`${hornTarget.user.username} has grown horns.`).then(xxxx=>{
                    hornTarget.removeRole(dlounge.roles.find(role => role.name === 'halo')).then(xx => {
                        message.reply(`${hornTarget.user.username} has been banished from heaven.`)
                        hornTarget.removeRole(dlounge.roles.find(role => role.name === 'soul')).then(xxx => {
                            message.reply(`${hornTarget.user.username} has fallen from earth.`)
                        }).catch(e => {
                            message.reply(`${hornTarget.user.username} had no soul.`).then(msgg=>{msgg.delete(5000)})
                        })
                    }).catch(e => {
                        message.reply(`${hornTarget.user.username} had no halo.`).then(msggg=>{msggg.delete(5000)})
                    })
                })
            }).catch(e => {
                message.reply(`${hornTarget.user.username} could not be damned.`).then(msgggg=>{msgggg.delete(5000)})
            })
        }
    
        if (command === "purge") {
            if (!message.member.roles.some(r => config.modRoles.includes(r.name)) && message.author.id !== "555509356637061136")
                return message.reply("Sorry, you don't have permissions to use this!");
    
            const deleteCount = parseInt(args[0], 10);
            if (!deleteCount || deleteCount < 2 || deleteCount > 100)
                return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
            const fetched = await message.channel.fetchMessages({
                limit: deleteCount
            });
            message.channel.bulkDelete(fetched)
                .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        }
    });
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.login(config.token);