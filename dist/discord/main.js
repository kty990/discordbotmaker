// ** Bot Dependancies **
const Discord = require('discord.js');
const { Guild } = require('discord.js');
const { Action } = require('./event.js');

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
var getCommandByName = (name) => {
    for (let x = 0; x < commands.length; x++) {
        if (commands[x].name.toLowerCase().substring(0, name.length) == name.toLowerCase()) {
            return commands[x];
        }
    }
    console.log(`Couldn't find command with name "${name}"`);
    return null;
}
let prefix = "!";

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
        Action.fire(`${err}`);
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
        console.log("Message recieved: ", message.content);
        if (message.author.id !== client.user.id) {
            console.log("Not a bot message");

            if (message.content.startsWith(prefix)) {
                console.log("Starts with prefix");
                let test = message.content.split(" ")[0].replace(prefix, "")
                let cmd = getCommandByName(test);
                if (cmd != null) {
                    console.log("Command found!");
                    let args = message.content.split(" ");
                    args.splice(0, 1);
                    cmd.run(message, ...args);
                    Action.fire("command", `${message.user}`, cmd.name, message.content);
                }

            }

        }
    })

    client.on('guildMemberRemove', member => {
        const { guild, user } = member;

        // Check if the member was kicked by a moderator
        guild.fetchAuditLogs({ type: 'MEMBER_KICK' })
            .then(auditLogs => {
                const kickLog = auditLogs.entries.first();
                if (kickLog && kickLog.target.id === user.id) {
                    const { executor } = kickLog;

                    // Moderator kicked the user
                    console.log(`User ${user.tag} was kicked from ${guild.name} by ${executor.tag}`);
                    Action.fire("kick", executor.name, user.name);
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
                    const { executor } = banLog;

                    // Moderator banned the user
                    console.log(`User ${user.tag} was banned in ${guild.name} by ${executor.tag}`);
                    Action.fire("ban", executor.name, user.name);
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

module.exports = { Start, Stop, add_handler, presence, Action, setCommands, GetClient, GetGuilds }