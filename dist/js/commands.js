let Notification;

import('./global.mjs').then(module => {
    Notification = module.Notification;
    console.log("Set global in commands.js");
}).catch(error => {
    console.error('Error importing global.mjs:', error);
}).finally(() => {
    console.log("Import finalized.");
});

const { Server2Server } = require('../discord/event');


class Command {
    constructor(name, adminLevel, args = [], description = "No description.", code = "") {
        this.name = name;
        this.adminLevel = adminLevel;
        this.description = description;
        this.executeFunction = async (message, ...a) => {
            await message.channel.send(`DEFAULT COMMAND:\n\t**Args:**\n${a.join("\n")}`);
        };
        this.code = code;
        this.args = args;
        this.aliases = [];
        this.data = [name, adminLevel, this.description, this.args, this.code];
    }

    deconstruct() {
        return [this.name, this.adminLevel, this.description, this.args, this.code];
    }
}

let everyone = 0;
let moderators = 1;
let owner = 2;

let help = new Command("help", everyone, [], "Get help regarding a specific mechanic of the bot, or general tips and tricks.");
help.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};
let fs = help.executeFunction.toString();
let code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
help.code = code || '';

let say = new Command("say", moderators, ["message"], "Repeats the given message in the same channel.");
say.executeFunction = async (message, ...args) => {
    let msg = args.join(" ");
    await message.channel.send(msg);
};
fs = say.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
say.code = code || '';

let sayEmbed = new Command("embed", moderators, ["message"], "Repeats the given message in the same channel, in an embed.");
sayEmbed.executeFunction = async (message, ...args) => {
    let embed = {
        description: `${args.join(" ")}`,
        author: {
            name: `\u2800`,
            icon_url: ''
        },
        color: 0x000000,
        timestamp: new Date().toISOString(),
        footer: {
            text: `Sent by: ${message.author.username}`,
            icon_url: `${message.author.avatarURL({ size: 256 })}`,
        },
    }

    // Sending the embed
    message.channel.send({ embeds: [embed] });

}
fs = sayEmbed.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
sayEmbed.code = code || '';

let info = new Command("info", everyone, [], "Provides information regarding the bot, a specific server, or a user.");
info.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};
fs = info.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
info.code = code || '';

let kick = new Command("kick", moderators, ['target', 'reason'], "Attempts to kick given user(s). Provides a reason.");
kick.executeFunction = async (message, ...args) => {
    let target = args.splice(0, 1);
    let reason = args.join(" ");
    if (target !== null && target !== undefined && reason !== null && reason !== undefined) {
        // User Id
        // Tagging

        let targetId = target.replace("<@", "").replace(">", "");
        targetId = parseInt(targetId);

        // Get user from id
        let user = message.guild.members.cache.get(targetId);

        if (user) {
            // Perform kick action
            // Example: await user.kick(reason);

            await user.kick(reason);
            await message.channel.send(`${user.user.tag} was kicked from this server for:\n\n\t> ${reason}`);
        } else {
            await message.channel.send(`KICK COMMAND - User not found`);
        }
    } else {
        await message.channel.send(`KICK COMMAND - Invalid syntax`);
    }
};
fs = kick.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
kick.code = code || '';

let ban = new Command("ban", moderators, ['target', 'reason'], "Attempts to ban given user(s). Provides a reason.");
ban.executeFunction = async (message, ...args) => {
    let target = args.splice(0, 1);
    let reason = args.join(" ");
    if (target !== null && target !== undefined && reason !== null && reason !== undefined) {
        // User Id
        // Tagging

        let targetId = target.replace("<@", "").replace(">", "");
        targetId = parseInt(targetId);

        // Get user from id
        let user = message.guild.members.cache.get(targetId);

        if (user) {
            // Perform ban action
            // Example: await user.ban({ reason: reason });

            await message.channel.send(`BAN COMMAND - Target: ${user.user.tag}, Reason: ${reason}`);
        } else {
            await message.channel.send(`BAN COMMAND - User not found`);
        }
    } else {
        await message.channel.send(`BAN COMMAND - Invalid syntax`);
    }
};
fs = ban.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
ban.code = code || '';

let play = new Command("play", everyone, ['query/url'], "Queues an audio track to be played.");
play.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};
fs = play.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
play.code = code || '';

let pause = new Command("pause", everyone, [], "Pauses an audio track.");
pause.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};
fs = pause.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
pause.code = code || '';

let resume = new Command("resume", everyone, [], "Resumes a paused audio track.");
resume.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};
fs = resume.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
resume.code = code || '';

let stop = new Command("stop", everyone, [], "Stops playing audio tracks.");
stop.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};
fs = stop.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
stop.code = code || '';

let cmds = new Command("cmds", everyone, ['page'], "Displays a list of commands.");
cmds.executeFunction = async (message, ...args) => {
    console.log("CMDS COMMAND");
    let commandList = "";
    for (let commandName in commands) {
        if (commands.hasOwnProperty(commandName)) {
            commandList += `${commands[commandName]}\n`;
        }
    }
    await message.channel.send(`List of available commands:\n${commandList}`);
};
fs = cmds.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
cmds.code = code || '';

let about = new Command("about", everyone, [], "Displays information about the bot.");
about.executeFunction = async (message, ...args) => {
    console.log("ABOUT COMMAND");
    let botName = message.client.user.username; // Replace with your bot's name
    let botDescription = "[ No description found ]"; // Replace with your bot's description
    let botVersion = "[ No version data found ]"; // Replace with your bot's version
    let author = "[ No author data found ]"; // Replace with your name or bot author's name
    let aboutMessage = `**${botName}**\n\n${botDescription}\n\nVersion: ${botVersion}\nAuthor: ${author}`;
    await message.channel.send(aboutMessage);
};
fs = about.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
about.code = code || '';

let leave = new Command("leave", everyone, [], "Leaves a voice channel if the bot and the user share a common voice channel.");
leave.executeFunction = async (message, ...args) => {
    console.log("LEAVE COMMAND");
    if (message.guild.me.voice.channel) {
        await message.guild.me.voice.channel.leave();
        await message.channel.send("Left the voice channel.");
    } else {
        await message.channel.send("I'm not in a voice channel.");
    }
};
fs = leave.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
leave.code = code || '';

let join = new Command("join", everyone, [], "Joins a voice channel with the user.");
join.executeFunction = async (message, ...args) => {
    console.log("JOIN COMMAND");
    if (message.member && message.member.voice.channel) {
        await message.member.voice.channel.join();
        await message.channel.send("Joined the voice channel.");
    } else {
        await message.channel.send("You must be in a voice channel to use this command.");
    }
};
fs = join.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
join.code = code || '';

let error = new Command("error", owner, [], "Throws an error to be displayed in the console.");
error.executeFunction = async (message, ...args) => {
    console.log("ERROR WAS USED");
    throw new Error("This is a test error using the \"error\" command.");
};
fs = error.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
error.code = code || '';

let notify = new Command("notify", owner, ["Type", "Description"], "Shows a notification for testing in the DBM UI.");
notify.executeFunction = async (message, ...args) => {
    let type = args[0];
    let notif = new Notification(Notification.types.info);

    switch (type.toLowerCase()) {
        case "info": //This is not required since it is default
        case "error":
            notif.type = Notification.types.error;
            break;
        case "warning":
            notif.type = Notification.types.warning;
            break;
        case "fatal":
            notif.type = Notification.types.fatal;
            break;
        default:
            break;
    }

    let description = args;
    description.splice(0, 1);
    description = description.join(" ");

    let element = notif.create("Test", description);
    Server2Server.fire({ client: true, action: "add-to-body" }, `<div id="notifications"></div>`);
    Server2Server.fire({ client: true, action: 'add-to-notifs' }, element)
}
fs = notify.executeFunction.toString();
code = fs.match(/[^{]*\{([\s\S]*)\}/)[1].trim();
notify.code = code || '';

// console.log(`notify code:\n\n${code}\n\n`);

var commands = [
    help,
    info,
    kick,
    ban,
    play,
    pause,
    resume,
    stop,
    join,
    leave,
    cmds,
    about,
    error,
    say,
    sayEmbed,
    notify
].sort((a, b) => a[1] - b[1]);


module.exports = { help, info, kick, ban, play, pause, resume, stop, join, leave, cmds, about, error, Command, everyone, moderators, owner, commands, say, sayEmbed, notify };
