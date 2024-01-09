const information = document.getElementById("information");
const modLog = document.getElementById("modLog");
const commandLog = document.getElementById("commandLog");

const start = document.getElementById("start");
const stp = document.getElementById("stop");

const guildSelect = document.getElementById("permission-guild-select");
const selectionArea = document.getElementById("selection-area");
const permissionsDiv = document.getElementById("perms");

const tokenTutorial = document.getElementById("tokenTutorial");
const tutorialBlur = document.getElementById("tutorialBlur");

const select = document.getElementById("select");
const create = document.getElementById("create");
const iname = document.getElementById("iname");
const ibot_status = document.getElementById("ibot-status");
const identity_select = document.getElementById("identify-selection");

let currentGuild = null;

const load = async () => {
    let name = await window.api.invoke("get-cache", { key: "bot-name" });
    let status = await window.api.invoke("get-cache", { key: "bot-status" });
    iname.textContent = name || "...";
    ibot_status.textContent = status;
    ibot_status.style.color = ((name || "...") != "Running") ? "#cc1111" : "117d11";
}

load().catch()

ibot_status.style.color = "#cc1111";

const permissionsList = [
    'add_reactions',
    'administrator',
    'attach_files',
    'ban_members',
    'change_nickname',
    'connect',
    'create_instant_invite',
    'create_private_threads',
    'create_public_threads',
    'deafen_members',
    'embed_links',
    'kick_members',
    'manage_messages',
    'manage_nicknames',
    'manage_roles',
    'manage_threads',
    'manage_webhooks',
    'manage_channels',
    'manage_emojis_and_stickers',
    'manage_guild',
    'manage_guild_expressions',
    'mention_everyone',
    'moderate_members',
    'move_members',
    'mute_members',
    'priority_speaker',
    'read_message_history',
    'request_to_speak',
    'send_embedded_activities',
    'send_messages',
    'send_messages_in_threads',
    'send_tts_messages',
    'send_voice_messages',
    'speak',
    'stream',
    'use_application_commands',
    'use_external_emojis',
    'use_external_stickers',
    'use_external_sounds',
    'use_vad',
    'use_creator_monetization_analytics',
    'use_private_threads',
    'use_public_threads',
    'use_external_voices',
    'view_audit_log',
    'view_channel',
    'view_creator_monetization_analytics',
    'view_guild_insights',
    'view_soundboard',
];

window.api.on("set_bot_status", (status) => {
    ibot_status.textContent = status;
    ibot_status.style.color = (status != "Running") ? "#cc1111" : "117d11";
})

let visible = false;
select.addEventListener("click", async () => {
    visible = !visible;
    if (identity_select.style.display == "block") {
        identity_select.style.display = "none";
    } else {
        identity_select.style.display = "block";
    }
    identity_select.innerHTML = "";
    const bots = await window.api.invoke("getBots"); // {name:token}
    for (const [name, data] of Object.entries(bots)) {
        const [lastOperation, token] = data;
        let botDiv = document.createElement("div");
        botDiv.classList.add("bot");

        let n = document.createElement("p");
        n.id = "name";
        n.textContent = name;
        botDiv.appendChild(n);

        let count = document.createElement("p");
        count.id = "";
        count.textContent = `Last operational: ${lastOperation}`;
        botDiv.appendChild(count);

        const listener = () => {
            window.api.send("select-bot", name);
            iname.textContent = name;
            window.api.send("edit-cache", { key: "bot-name", value: name });
            ibot_status.textContent = "Offline";
        }

        botDiv.addEventListener("click", listener);

        identity_select.appendChild(botDiv);
    }
})

create.addEventListener("click", () => {

})

selectionArea.style.display = "none";
identity_select.style.display = "none";

guildSelect.addEventListener("click", async () => {
    if (selectionArea.style.display) {
        if (selectionArea.style.display == "none") {
            selectionArea.style.display = "block";
        } else {
            selectionArea.style.display = "none";
        }
    } else {
        selectionArea.style.display = "none";
    }
    selectionArea.innerHTML = "";
    let guilds = await window.api.invoke("createGuildSelect-servernick");

    let objs = Object.entries(guilds)
    let divs = [];

    for (const [_, guild] of objs) {
        let div = document.createElement("div");
        div.classList.add("guild");
        let img = document.createElement("img");
        img.src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
        img.alt = "guild icon";
        img.id = "iconID";
        div.appendChild(img);
        let name = document.createElement("p");
        name.id = "name";
        name.textContent = `${guild.name}`
        div.appendChild(name);
        let di = document.createElement("p");
        di.id = "id";
        di.textContent = `${guild.id}`;
        div.appendChild(di);

        divs.push(div);

        div.addEventListener("click", async () => {
            for (let div of divs) {
                div.style.filter = null;
                div.querySelector("img").style.filter = null;
            }
            div.style.filter = "invert(1)";
            img.style.filter = "invert(1)";

            currentGuild = guild;

            guildSelect.querySelector("img").src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
            guildSelect.querySelector("#guild-name").textContent = guild.name;
            guildSelect.querySelector("#guild-id").textContent = `(${guild.id})`;

            // const myguild = await window.api.invoke("GetGuildFromID", guild.id);
            let permissions = [];
            let channels = await window.api.invoke("GetChannelsInGuild", guild);
            for (let x = 0; x < channels.length; x++) {
                let channel = channels[x];
                let p = await window.api.invoke("GetPermissionsInChannelForBot", [guild.id, channel.id]);
                for (let x = 0; x < p.length; x++) {
                    if (!permissions.includes(p[x].toLowerCase())) {
                        permissions.push(p[x].toLowerCase());
                    }
                }
            }
            permissionsDiv.innerHTML = '';
            let rolePerms = await window.api.invoke("GetRolePermissionsForBot", guild);
            for (let x = 0; x < rolePerms.length; x++) {
                if (!permissions.includes(rolePerms[x].replace("_", "").replace("_", "").replace("_", ""))) {
                    permissions.push(rolePerms[x].replace("_", "").replace("_", "").replace("_", ""));
                }
            }
            permissions = permissions.sort();
            for (let x = 0; x < permissionsList.length; x++) {
                let per = permissionsList[x].toLowerCase().replace("_", " ").replace("_", " ").replace("_", " ");
                let div = document.createElement("div");
                div.classList.add("permission");
                let img = document.createElement("img");
                div.appendChild(img);
                let p = document.createElement("p");
                p.textContent = per.toUpperCase();
                div.appendChild(p);
                permissionsDiv.appendChild(div);
                if (permissions.includes(permissionsList[x].toLowerCase().replace("_", "").replace("_", "").replace("_", ""))) {
                    // Valid permission
                    p.textContent = `${p.textContent}`;
                    img.src = "../images/check.png";
                } else {
                    // Permission not given
                    p.textContent = `${p.textContent}`;
                    img.src = "../images/x.png";
                }
            }
        })

        selectionArea.appendChild(div);
    }
})

start.addEventListener("click", () => {
    window.api.send("action", "start");
})

stp.addEventListener("click", () => {
    window.api.send("action", "stop");
})

function createNotification(t = "Notification", description = "Something went wrong! Error Code: 500", type) {
    const notif = `<div class="notification">
    <div id="topbar"${(type !== null) ? `style="background-color:${type};"` : ''}>
        <p id="title">${t}</p>
        <p id="close-notif">X</p>
    </div>
    <p id="description-notif">${description}</p>
</div>`;
    return notif;
}

function addAction(data) {
    let p = document.createElement("p");
    p.textContent = `${data}`;
    information.appendChild(p);
}

function addError(data) {
    let p = document.createElement("p");
    data.splice(0, 1);
    p.textContent = `${data}`;
    p.classList.add("red");
    information.appendChild(p);
}

function addCommand(data) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    div.classList.add("command");
    p.classList.add("cmd-label");
    p.textContent = `${data[2]}`;
    p2.classList.add("cmd-user");
    p2.textContent = `${data[1]}`;
    p3.classList.add("cmd-timestamp");
    if (data.length == 5) {
        p3.textContent = `${data[4].split(",")[1].toUpperCase().replace(".", "")}`;
    } else {
        p3.textContent = `${data[5].toUpperCase().replace(".", "")}`;
    }
    div.appendChild(p);
    div.appendChild(p2);
    div.appendChild(p3);
    commandLog.appendChild(div);
}

function addModeration(data) {
    let div = document.createElement("div");
    let p = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let p4 = document.createElement("p");
    let p5 = document.createElement("p");
    div.classList.add("action");
    p.classList.add("action-label");
    p.textContent = `${data[1]}`;

    p2.classList.add("action-user");
    p2.textContent = `${data[2]}`;

    p3.classList.add("action-target");
    p3.textContent = `${data[3]}`

    p4.classList.add("action-reason");
    p4.textContent = `${data[4]}`

    p5.classList.add("action-timestamp");

    if (data.length == 5) {
        p5.textContent = `${data[4].split(",")[1].toUpperCase().replace(".", "")}`;
    } else {
        p5.textContent = `${data[5].toUpperCase().replace(".", "")}`;
    }
    div.appendChild(p);
    div.appendChild(p2);
    div.appendChild(p3);
    div.appendChild(p4);
    div.appendChild(p5);
    modLog.appendChild(div);
}

window.api.on("action", (d) => {
    let data = d[0];
    console.log(`Data from home.js: ${data}`);
    //              TYPE          ARGS..............................
    //Action.fire("command", `${message.user}`, cmd.name, message.content);

    if (data[0] == "command") {
        addCommand(data);
    } else if (data[0] == "mod") {
        addModeration(data);
    } else if (data[0] == "err") {
        addError(data);
    } else {
        addAction(data);
    }
})

window.api.on("terminate", () => {
    selectionArea.innerHTML = "";
})

window.api.on("botStarted", () => {
    ibot_status.textContent = "Running";
    ibot_status.style.color = "#117d11";
    window.api.send("edit-cache", { key: "bot-status", value: "Running" })
})

window.api.on("botStopped", () => {
    ibot_status.textContent = "Offline";
    ibot_status.style.color = "#cc1111";
    window.api.send("edit-cache", { key: "bot-status", value: "Offline" })
})

tokenTutorial.addEventListener("click", () => {
    if (tutorial.style.display !== "block") {
        tutorial.style.display = "block";
        tutorialBlur.style.display = "block";
    } else {
        tutorial.style.display = "none";
        tutorialBlur.style.display = "none";
    }
})


async function main() {
    let output = await window.api.invoke("console-action-home", { set: false });
    // output.reverse();
    for (let value of output) {
        addAction(value);
    }

    let commands = await window.api.invoke("command-action-home", { set: false });
    for (let command of commands) {
        let data = command.split(",");
        addCommand(data);
    }

    let modActions = await window.api.invoke("mod-action-home", { set: false });
    for (let action of modActions) {
        let data = action.split(",");
        addModeration(data);
    }

    let errActions = await window.api.invoke("err-action-home", { set: false });
    for (let action of errActions) {
        let data = action.split(",");
        addError(data);
    }
}

main();