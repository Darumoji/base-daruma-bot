let fs = require('fs')
const Discord = require("discord.js")
const client = new Discord.Client()
const triggers = require("./triggers.json")
const token = require("./token.json").token

let funcMap = {
    "say": (targetParams) => {
        let channel = targetParams[0]
        let content = targetParams[1]
        channel.send(content)
    },
    "hug": (targetParams) => {
        let channel = targetParams[0]
        let user = targetParams[1]
        channel.send(`<(^.^)> ${user}`)
    },
    "react": (targetParams) => {
        let message = targetParams[0]
        let emojiName = targetParams[1]
        let emojires = client.emojis.find(emoji => emoji.name === emojiName)
        if (emojires) message.channel.fetchMessages({ limit: 2 }).then(messages => {
            let msgArr = messages.array()
            if(msgArr[0].author.id === msgArr[1].author.id) msgArr[1].clearReactions()
            message.react(emojires)
        })
    }
}

client.on("ready", () => {
    client.user.setActivity(`Haha!  Hoho!`);
    client.on("message", async message => {
        if (message.author.bot) return
        for (let trig in triggers) {
            let trigger = triggers[trig]
            if (!trigger.message || !trigger.target) continue
            let msgParams = false
            let msgOrMatch = false
            for (let msgInd in trigger.message) {
                let msgAndConditions = trigger.message[msgInd]
                let msgAndMatch = true
                for (let msgAndInd in msgAndConditions) {
                    let msgTrigger = msgAndConditions[msgAndInd]
                    if (msgTrigger.text) {
                        let matchRegex = RegExp(msgTrigger.text);
                        let msgMatches = message.content.match(matchRegex)
                        if (msgMatches === null) msgAndMatch = false
                        else {
                            msgParams = msgMatches
                        }
                    }
                    if (msgTrigger.emoji && !(message.content.indexOf(`${client.emojis.find(emoji => emoji.name === msgTrigger.emoji)}`) > -1)) msgAndMatch = false
                    if (msgTrigger.user && !(message.author.tag === msgTrigger.user)) msgAndMatch = false
                }
                if (msgAndMatch) msgOrMatch = true
            }
            if (!msgOrMatch) continue
            if (trigger.authorization) {
                let authOrMatch = false
                for (let authInd in trigger.authorization) {
                    let authAndConditions = trigger.authorization[authInd]
                    let authAndMatch = true
                    for (let authAndInd in authAndConditions) {
                        let auth = authAndConditions[authAndInd]
                        if (auth.guild && message.guild.name !== auth.guild) authAndMatch = false
                        if (auth.role && !message.member.roles.some(r => auth.role === r.name)) authAndMatch = false
                    }
                    if (authAndMatch) authOrMatch = true
                }
                if (!authOrMatch) continue
            }
            let targetSplit = trigger.target.split('/')
            if (targetSplit.length > 0) {
                let targetFunc = false
                let targetParams = []
                for (let splitInd in targetSplit) {
                    let targetParam = targetSplit[splitInd]
                    if (splitInd < 1) {
                        targetFunc = funcMap[targetParam]
                        if (!targetFunc) return console.log('invalid target func', message.member.nickname || message.author.username, message.content)
                        continue
                    }
                    if (targetParam === '$guild') {
                        targetParams.push(message.guild)
                        continue
                    }
                    if (targetParam === '$message') {
                        targetParams.push(message)
                        continue
                    }
                    if (targetParam === '$user') {
                        targetParams.push(message.user)
                        continue
                    }
                    if (targetParam === '$member') {
                        targetParams.push(message.member)
                        continue
                    }
                    if (targetParam === '$channel') {
                        targetParams.push(message.channel)
                        continue
                    }
                    let paramMatch = targetParam.match(/\$([0-9]+)/)
                    if (paramMatch !== null && paramMatch.length > 0) {
                        let msgParamIndex = parseInt(paramMatch[1])
                        if (!(msgParams.length > msgParamIndex)) return message.channel.send(`Invalid Target Parameters Provided, ${message.member.nickname}`)
                        targetParams.push(msgParams[msgParamIndex])
                        continue
                    }
                    targetParams.push(targetParam)
                }
                targetFunc(targetParams)
            }
        }
    })
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`)
})
client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
})
client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
})
client.login(token)