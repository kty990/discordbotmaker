class Command {
    constructor(name, adminLevel, args) {
        this.name = name;
        this.adminLevel = adminLevel;
        this.run = async (message, ...args) => {
            console.log("DEFAULT COMMAND");
            await message.channel.send(`DEFAULT COMMAND:\n\t**Args:**\n${args.join("\n")}`);
        };
        this.args = args || [];
        this.aliases = [];
        this.data = [name, adminLevel, this.args];
    }
}

let everyone = 0;
let moderators = 1;
let owner = 2;

let help = new Command("help", everyone);
help.run = async (message, ...args) => {
    console.log("HELP COMMAND");
    await message.channel.send(`HELP COMMAND:\n\t**Args:**\n${args.join("\n")}`);
};

let info = new Command("info", everyone);
info.run = async (message, ...args) => {
    console.log("INFO COMMAND");
    await message.channel.send(`INFO COMMAND:\n\t**Args:**\n${args.join("\n")}`);
};

let kick = new Command("kick", moderators, ['target', 'reason']);
kick.run = async (message, ...args) => {
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

            console.log(`KICK COMMAND - Target: ${user.user.tag}, Reason: ${reason}`);
            await message.channel.send(`KICK COMMAND - Target: ${user.user.tag}, Reason: ${reason}`);
        } else {
            console.log(`KICK COMMAND - User not found`);
            await message.channel.send(`KICK COMMAND - User not found`);
        }
    } else {
        console.log(`KICK COMMAND - Invalid syntax`);
        await message.channel.send(`KICK COMMAND - Invalid syntax`);
    }
};

let ban = new Command("ban", moderators, ['target', 'reason']);
ban.run = async (message, ...args) => {
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

            console.log(`BAN COMMAND - Target: ${user.user.tag}, Reason: ${reason}`);
            await message.channel.send(`BAN COMMAND - Target: ${user.user.tag}, Reason: ${reason}`);
        } else {
            console.log(`BAN COMMAND - User not found`);
            await message.channel.send(`BAN COMMAND - User not found`);
        }
    } else {
        console.log(`BAN COMMAND - Invalid syntax`);
        await message.channel.send(`BAN COMMAND - Invalid syntax`);
    }
};

let play = new Command("play", everyone, ['query/url']);
play.run = async (message, ...args) => {
    console.log("PLAY COMMAND");
    await message.channel.send(`PLAY COMMAND:\n\t**Args:**\n${args.join("\n")}`);
};

let pause = new Command("pause", everyone);
pause.run = async (message, ...args) => {
    console.log("PAUSE COMMAND");
    await message.channel.send(`PAUSE COMMAND:\n\t**Args:**\n${args.join("\n")}`);
};

let resume = new Command("resume", everyone);
resume.run = async (message, ...args) => {
    console.log("RESUME COMMAND");
    await message.channel.send(`RESUME COMMAND:\n\t**Args:**\n${args.join("\n")}`);
};

let stop = new Command("stop", everyone);
stop.run = async (message, ...args) => {
    console.log("STOP COMMAND");
    await message.channel.send(`STOP COMMAND:\n\t**Args:**\n${args.join("\n")}`);
};

let cmds = new Command("cmds", everyone, ['page']);
cmds.run = async (message, ...args) => {
    console.log("CMDS COMMAND");
    let commandList = "";
    for (let commandName in commands) {
        if (commands.hasOwnProperty(commandName)) {
            commandList += `${commandName}\n`;
        }
    }
    await message.channel.send(`List of available commands:\n${commandList}`);
};

let about = new Command("about", everyone);
about.run = async (message, ...args) => {
    console.log("ABOUT COMMAND");
    let botName = "Your Bot Name"; // Replace with your bot's name
    let botDescription = "Your Bot Description"; // Replace with your bot's description
    let botVersion = "1.0.0"; // Replace with your bot's version
    let author = "Your Name"; // Replace with your name or bot author's name
    let aboutMessage = `**${botName}**\n\n${botDescription}\n\nVersion: ${botVersion}\nAuthor: ${author}`;
    await message.channel.send(aboutMessage);
};

let leave = new Command("leave", everyone);
leave.run = async (message, ...args) => {
    console.log("LEAVE COMMAND");
    if (message.guild.me.voice.channel) {
        await message.guild.me.voice.channel.leave();
        await message.channel.send("Left the voice channel.");
    } else {
        await message.channel.send("I'm not in a voice channel.");
    }
};

let join = new Command("join", everyone);
join.run = async (message, ...args) => {
    console.log("JOIN COMMAND");
    if (message.member && message.member.voice.channel) {
        await message.member.voice.channel.join();
        await message.channel.send("Joined the voice channel.");
    } else {
        await message.channel.send("You must be in a voice channel to use this command.");
    }
};

var commands = [
    help.data,
    info.data,
    kick.data,
    ban.data,
    play.data,
    pause.data,
    resume.data,
    stop.data,
    join.data,
    leave.data,
    cmds.data,
    about.data
];


module.exports = { help, info, kick, ban, play, pause, resume, stop, join, leave, cmds, about, Command, everyone, moderators, owner, commands };
