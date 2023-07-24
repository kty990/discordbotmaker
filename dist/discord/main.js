// ** Bot Dependancies **
const Discord = require('discord.js');
const { Guild } = require('discord.js');
const { Action } = require('./event.js');
const fs = require('fs');

const { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } = require('@discordjs/voice');

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
    Intents.GuildVoiceStates,
]

var client = null;
var settings = null;

function setSettings(s) {
    settings = s;
}

function ShowError(msg) {
    let e = {};
}

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

function startListening(channel) {

}

async function startSpeaking(channel) {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
        // Create a new Opus recorder
        const recorder = new Recorder({
            channels: 1,
            rate: 48000,
            frameSize: 960,
            encoderApplication: 2049,
        });

        // Create a readable stream from the recorder
        const audioStream = new Readable({
            read() { },
        });

        audioStream.pipe(recorder.stream);

        // Listen to the "data" event from the recorder and play the audio
        recorder.stream.on('data', (chunk) => {
            const resource = createAudioResource(chunk, { inputType: 'opus' });
            audioPlayer.play(resource);
        });

        const audioPlayer = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
            },
        });

        connection.subscribe(audioPlayer);
    } catch (error) {
        console.error(error);
    }
}

function executeCommand(name, ...args) {
    let cmd = getCommandByName(name);
    cmd.executeFunction(null, ...args).catch((e) => {
        Action.fire("err", `${e}`);
    });
}

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

    client.on("messageCreate", async message => {
        // console.log("Message recieved: ", message.content);
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
                    const GetAdminLevel = () => {
                        const member = message.member;
                        const roles = member.roles.cache;
                        let adminLevel = 0;
                        for (const [snowflake, role] of roles) {
                            // Do comparison between role.id and all ids in settings.json
                            for (let data of settings.moderatorRoles) {
                                if (role.id == data.id) {
                                    adminLevel = 1;
                                    break;
                                }
                            }

                            for (let data of settings.ownerRoles) {
                                if (role.id == data.id) {
                                    adminLevel = 2;
                                    break;
                                }
                            }
                        }
                        console.log(adminLevel);
                        return adminLevel;
                    }

                    /** */
                    console.log(`Is Admin level: ${GetAdminLevel()}, ${cmd.adminLevel}`);
                    if (GetAdminLevel() >= cmd.adminLevel) {
                        cmd.executeFunction(message, ...args).catch((e) => {
                            Action.fire("err", `${e}`);
                        });
                    } else {
                        let permissionName = "Everyone";
                        if (cmd.adminLevel == 1) {
                            permissionName = "Moderator"
                        } else if (cmd.adminLevel == 2) {
                            permissionName = "Owner";
                        }

                        let YpermissionName = "Everyone";
                        if (GetAdminLevel() == 1) {
                            YpermissionName = "Moderator"
                        } else if (GetAdminLevel() == 2) {
                            YpermissionName = "Owner";
                        }
                        let d = new Date();
                        let embed = {
                            description: `<@${message.author.id}> does not have the valid permissions to use ${cmd.name}`,
                            fields: [{
                                name: "Required permission level".toUpperCase(),
                                value: `${permissionName} (${cmd.adminLevel})`,
                                inline: false
                            },
                            {
                                name: "Your permission level".toUpperCase(),
                                value: `${YpermissionName} (${cmd.adminLevel})`,
                                inline: false
                            }],
                            author: {
                                name: client.user.username,
                                icon_url: client.user.avatarURL({ size: 256 })
                            },
                            color: 0xfc0000,
                            timestamp: d.toISOString(),
                            footer: {
                                text: '\u2800',
                                icon_url: '',
                            },
                        }
                        await message.channel.send({
                            embeds: [embed],
                        });
                    }

                    /** */

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

module.exports = {
    Start,
    Stop,
    add_handler,
    presence,
    Action,
    setCommands,
    GetClient,
    GetGuilds,
    setPrefix,
    LoadPlugins,
    executeCommand,
    setSettings,
    startListening,
    startSpeaking
}