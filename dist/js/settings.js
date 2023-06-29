let selectServerNick = document.getElementById("button");
let nickname_selector = document.getElementById("nickname-selector");
let nickname = document.getElementById("nickname").querySelector("p");

selectServerNick.addEventListener("click", async () => {
    if (nickname_selector.style.display == "none") {
        nickname_selector.style.display = "block";
    } else {
        nickname_selector.style.display = "none";
    }
    if (nickname_selector.style.display == "none") return;
    while (nickname_selector.firstChild) {
        nickname_selector.removeChild(nickname_selector.firstChild);
    }
    let guilds = await window.api.invoke("createGuildSelect-servernick");
    let objs = Object.entries(guilds)
    let divs = [];
    let currentGuild = null;
    for (const [_, guild] of Object.entries(guilds)) {
        let div = document.createElement("div");
        div.classList.add("guild");
        let img = document.createElement("img");
        img.src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
        img.alt = "HAHAHAHAHA";
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

        // <div class="guild">
        //             <p id="name"></p>
        //             <p id="id"></p>
        //             <img alt="guild-icon">
        //         </div>
    }
})

if (nickname_selector.style.display == "none") {
    nickname_selector.style.display = "block";
} else {
    nickname_selector.style.display = "none";
}