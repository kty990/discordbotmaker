// ** Bot Dependancies **
const Discord = require('discord.js');
const { Guild } = require('discord.js');
const { Action } = require('./event.js');
const fs = require('fs');

// ** Misc. Variables **

const Intents = Discord.GatewayIntentBits;
const Partials = Discord.Partials;

var selectedPartials = [Partials.Message, Partials.Channel, Partials.Reaction];
var selectedIntents = [
    Intents.DirectMessages,
    Intents.DirectMessageReactions,
    Intents.GuildMessages,
    Intents.GuildMessageReactions,
    Intents.GuildMembers,
    Intents.GuildPresences,
    Intents.Guilds,
    Intents.MessageContent,
    Intents.GuildVoiceStates
]

var client = null;

var presence = {
    type: Discord.ActivityType.Playing,
    name: "the default game!",
    status: 'idle'
}

const guilds = [];

var commands = null;
var setCommands = (cmds) => {
    commands = cmds;
}

let pluginCommands = [];

var getCommandByName = (name) => {
    for (let x = 0; x < commands.length; x++) {
        if (commands[x].name.toLowerCase().substring(0, name.length) == name.toLowerCase()) {
            return commands[x];
        }
    }

    for (let x = 0; x < pluginCommands.length; x++) {
        if (pluginCommands[x].name.toLowerCase().substring(0, name.length) == name.toLowerCase()) {
            return pluginCommands[x];
        }
    }
    console.log(`Couldn't find command with name "${name}"`);
    return null;
}
let prefix = "!";

const setPrefix = np => {
    prefix = np;
}

// ** Functions **

function Start(token) {
    if (client !== null) {
        Action.fire("Already running...");
        return;
    }
    client = new Discord.Client({
        partials: selectedPartials,
        intents: selectedIntents,
    });
    client.on("error", (err) => {
        Action.fire("err", `${err}`);
    })
    client.login(token)
        .then(async () => {
            Action.fire("Successful login!");
            client.guilds.fetch().then((guildPartials) => {
                for (let partial of guildPartials) {
                    partial[1].fetch().then(guild => {
                        guilds.push(guild);
                    }).catch(console.error)
                }
            }).catch(console.error);
        }).catch(e => {
            Action.fire(`${e}`);
        });

    client.on("guildCreate", guild => {
        if (!guilds.includes(guild)) {
            guilds.push(guild);
        }
    });

    client.on("messageCreate", message => {
        // console.log("Message recieved: ", message.content);
        if (message.author.id !== client.user.id) {
            console.log("Not a bot message");

            if (message.content.startsWith(prefix)) {
                console.log("Starts with prefix");
                let test = message.content.split(" ")[0].replace(prefix, "")
                let cmd = getCommandByName(test);
                const getAuthLevel = (authorID, adminLevel) => {
                    return true; // temporary
                }
                if (cmd != null && getAuthLevel(message.author.id, cmd.adminLevel)) {
                    console.log("Command found!");
                    let args = message.content.split(" ");
                    args.splice(0, 1);
                    cmd.executeFunction(message, ...args).catch((e) => {
                        Action.fire("err", `${e}`);
                    });
                    let d = new Date(message.createdTimestamp);
                    Action.fire("command", message.author.username, cmd.name, message.content, d.toLocaleString());
                } else if (cmd != null) {
                    Action.fire("err", `${message.author.username} attempted to use ${cmd.name} without the proper permissions.`);
                }

            }

        }
    })

    client.on('guildMemberRemove', member => {
        const { guild, user } = member;

        // Check if the member was kicked by a moderator
        guild.fetchAuditLogs()
            .then(auditLogs => {
                const kickLog = auditLogs.entries.first();
                if (kickLog && kickLog.target.id === user.id) {
                    const { executor, reason, createdTimestamp } = kickLog;

                    // Moderator kicked the user
                    console.log(`User ${user.tag} was kicked from ${guild.name} by ${executor.tag}`);
                    let d = new Date(createdTimestamp);
                    Action.fire("mod", "kick", executor.username, user.username, reason, d.toLocaleString().split(", ")[1]);
                    // Handle the kick action here
                }
            })
            .catch(console.error);
    });

    client.on('guildBanAdd', (guild, user) => {
        // Check if the ban was performed by a moderator
        guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' })
            .then(auditLogs => {
                const banLog = auditLogs.entries.first();
                if (banLog && banLog.target.id === user.id) {
                    const { executor, reason, createdTimestamp } = banLog;

                    // Moderator banned the user
                    console.log(`User ${user.tag} was banned in ${guild.name} by ${executor.tag}`);
                    Action.fire("mod", "ban", executor.name, user.name, reason, createdTimestamp);
                    // Handle the ban action here
                }
            })
            .catch(console.error);
    });

}

function Stop() {
    if (client !== null) {
        client.destroy();
        client = null;
        Action.fire("Stopping...");
    } else {
        Action.fire("Bot not running...");
    }

}

function add_handler(func) {
    Action.add_handler(func);
}

function GetClient() {
    return client;
}

function GetGuilds() {
    return guilds;
}

function AddPlugin(pData) {
    pluginCommands.push(pData);
}

async function LoadPlugins() {
    const GetFiles = () => {
        return new Promise((resolve, reject) => {
            fs.readdir("./dist/plugins/", (err, files) => {
                if (!err) {
                    resolve(files);
                } else {
                    reject(err);
                }
            });
        })
    }
    Action.fire("Reloading plugins... please wait a moment for this to finish!");
    let files = await GetFiles();
    let globalPlugins = [];
    pluginCommands = [];
    console.log(files, typeof files);
    for (let file of files) {
        let data = require(`../plugins/${file}`);
        if (data.isCommand) {
            pluginCommands.push(data);
        } else {
            globalPlugins.push(data);
        }
    }
    return [globalPlugins, pluginCommands];
}

module.exports = { Start, Stop, add_handler, presence, Action, setCommands, GetClient, GetGuilds, setPrefix, LoadPlugins, AddPlugin }