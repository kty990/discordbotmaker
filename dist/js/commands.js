class Command {
    constructor(name, adminLevel, args = [], description = "No description.") {
        this.name = name;
        this.adminLevel = adminLevel;
        this.description = description;
        this.executeFunction = async (message, ...args) => {
            console.log("DEFAULT COMMAND");
            await message.channel.send(`DEFAULT COMMAND:\n\t**Args:**\n${args.join("\n")}`);
        };
        this.args = args;
        this.aliases = [];
        this.data = [name, adminLevel, this.description, this.args];
    }
}

let everyone = 0;
let moderators = 1;
let owner = 2;

let help = new Command("help", everyone, [], "Get help regarding a specific mechanic of the bot, or general tips and tricks.");
help.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};

let info = new Command("info", everyone, [], "Provides information regarding the bot, a specific server, or a user.");
info.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};

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

            console.log(`KICK COMMAND - Target: ${user.user.tag}, Reason: ${reason}`);
            await user.kick(reason);
            await message.channel.send(`${user.user.tag} was kicked from this server for:\n\n\t> ${reason}`);
        } else {
            console.log(`KICK COMMAND - User not found`);
            await message.channel.send(`KICK COMMAND - User not found`);
        }
    } else {
        console.log(`KICK COMMAND - Invalid syntax`);
        await message.channel.send(`KICK COMMAND - Invalid syntax`);
    }
};

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

let play = new Command("play", everyone, ['query/url'], "Queues an audio track to be played.");
play.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};

let pause = new Command("pause", everyone, [], "Pauses an audio track.");
pause.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};

let resume = new Command("resume", everyone, [], "Resumes a paused audio track.");
resume.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};

let stop = new Command("stop", everyone, [], "Stops playing audio tracks.");
stop.executeFunction = async (message, ...args) => {
    await message.channel.send(`This command is not ready quite yet!`);
};

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

let about = new Command("about", everyone, [], "Displays information about the bot.");
about.executeFunction = async (message, ...args) => {
    console.log("ABOUT COMMAND");
    let botName = "Your Bot Name"; // Replace with your bot's name
    let botDescription = "Your Bot Description"; // Replace with your bot's description
    let botVersion = "1.0.0"; // Replace with your bot's version
    let author = "Your Name"; // Replace with your name or bot author's name
    let aboutMessage = `**${botName}**\n\n${botDescription}\n\nVersion: ${botVersion}\nAuthor: ${author}`;
    await message.channel.send(aboutMessage);
};

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

let error = new Command("error", owner, [], "Throws an error to be displayed in the console.");
error.executeFunction = async (message, ...args) => {
    console.log("ERROR WAS USED");
    throw new Error("This is a test error using the \"error\" command.");
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
    about.data,
    error.data
];


module.exports = { help, info, kick, ban, play, pause, resume, stop, join, leave, cmds, about, error, Command, everyone, moderators, owner, commands };
