let selectServerNick = document.getElementById("button");
let nickname_selector = document.getElementById("nickname-selector");
let nickname = document.getElementById("nickname").querySelector("p");
let loading = document.getElementById("loader");
let submit = document.getElementById("submit");

let prefix = document.getElementById("prefix");
let logChannel = document.getElementById("logChannel");
let username = document.getElementById("username");
let nick = document.getElementById("serverNick");

/**
 * 
 * <div id="settingsPanel">
        <p>Prefix</p>
        <input id="prefix">
        <p>Logging Channel</p>
        <input id="logChannel">
        <p>Username</p>
        <input id="username">
        <p>Server Nickname</p>
        <div id="nickname">
            <p>Nothing selected</p>
            <input id="button" type="button" value="Select Server">
        </div>
        <div id="nickname-selector">
            Processing...
        </div>
        <div id="loader">
        </div>

        <input id="serverNick">

        <input id="submit" type="button" value="Submit">
    </div>
 */

function wait(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

let currentGuild = null;

selectServerNick.addEventListener("click", async () => {
    if (nickname_selector.style.display == "none") {
        nickname_selector.style.display = "block";
    } else {
        nickname_selector.style.display = "none";
    }
    if (nickname_selector.style.display == "none") return;
    nickname_selector.innerHTML = "";
    loading.style.visibility = "visible";

    let guilds = await window.api.invoke("createGuildSelect-servernick");
    let objs = Object.entries(guilds)
    let divs = [];

    for (const [_, guild] of Object.entries(guilds)) {
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

        div.addEventListener("click", () => {
            for (let div of divs) {
                div.style.filter = null;
                div.querySelector("img").style.filter = null;
            }
            div.style.filter = "invert(1)";
            img.style.filter = "invert(1)";

            currentGuild = guild;
            nickname.textContent = `Guild: ${guild.name}`;
        })

        nickname_selector.appendChild(div);
    }
    loading.style.visibility = "hidden";
})

submit.addEventListener("click", () => {
    const data = {
        'prefix': prefix.value,
        'username': username.value,
        'logChannel': logChannel.value,
        "serverNickGuild": currentGuild,
        "serverNick": nick.value
    }
    window.api.send("settingsMod", data);
})




loading.style.visibility = "hidden";
if (nickname_selector.style.display == "none") {
    nickname_selector.style.display = "block";
} else {
    nickname_selector.style.display = "none";
}