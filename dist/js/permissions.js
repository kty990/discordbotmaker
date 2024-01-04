let guildSelect = document.getElementById("guild-select");
let selectionArea = document.getElementById("selection-area");
let rolesDiv = document.getElementById("roles");

let modAddBtn = document.getElementById("mod").querySelector(".addToWhitelistBtn").querySelector("#plus");
let modSubBtn = document.getElementById("mod").querySelector(".addToWhitelistBtn").querySelector("#x");
let ownerAddBtn = document.getElementById("owner").querySelector(".addToWhitelistBtn").querySelector("#plus");
let ownerSubBtn = document.getElementById("owner").querySelector(".addToWhitelistBtn").querySelector("#x");

let ownerRoleDisplay = document.getElementById("owner").querySelector("#roleCollection");
let modRoleDisplay = document.getElementById("mod").querySelector("#roleCollection");

class Role {
    constructor(name, id, color) {
        this.name = name;
        this.id = id;
        this.color = color;
    }

    serialize() {
        return `{
            name: ${this.name},
            id: ${this.id},
            color: ${this.color}
        }`
    }
}

let currentRole, currentGuild, allRoles = [Role];

selectionArea.style.display = "none";


function adjustBrightness(color, brightness) {
    // Check if the color is in RGB format (e.g., "rgb(255, 0, 0)")
    if (color.startsWith("rgb")) {
        // Parse the color string into its RGB components
        const rgb = color.match(/\d+/g);
        const red = parseInt(rgb[0]);
        const green = parseInt(rgb[1]);
        const blue = parseInt(rgb[2]);

        // Calculate the adjusted brightness
        const adjustedRed = Math.max(0, Math.min(255, red * brightness));
        const adjustedGreen = Math.max(0, Math.min(255, green * brightness));
        const adjustedBlue = Math.max(0, Math.min(255, blue * brightness));

        // Construct the adjusted color string
        const adjustedColor = `rgb(${adjustedRed}, ${adjustedGreen}, ${adjustedBlue})`;

        return adjustedColor;
    } else if (color.startsWith("#")) {
        // Check if the color is in hexadecimal format (e.g., "#FF0000")
        const hex = color.replace("#", "");
        const num = parseInt(hex, 16);

        // Extract the RGB components from the hexadecimal value
        const red = (num >> 16) & 255;
        const green = (num >> 8) & 255;
        const blue = num & 255;

        // Calculate the adjusted brightness
        const adjustedRed = Math.max(0, Math.min(255, red * brightness));
        const adjustedGreen = Math.max(0, Math.min(255, green * brightness));
        const adjustedBlue = Math.max(0, Math.min(255, blue * brightness));

        // Convert the adjusted RGB components back to hexadecimal format
        const adjustedHex = `#${(adjustedRed << 16 | adjustedGreen << 8 | adjustedBlue).toString(16).padStart(6, "0")}`;

        return adjustedHex;
    } else {
        // Invalid color format
        return null;
    }
}

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

            rolesDiv.innerHTML = "";

            currentGuild = guild;

            guildSelect.querySelector("img").src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
            guildSelect.querySelector("#guild-name").textContent = guild.name;
            guildSelect.querySelector("#guild-id").textContent = `(${guild.id})`;

            // const myguild = await window.api.invoke("GetGuildFromID", guild.id);

            const roles = await window.api.invoke("GetRolesViaGuildId", guild.id);
            for (let role of roles) {
                let found = false;
                let tempRole;
                for (let r of allRoles) {
                    if (r.name == role.name) {
                        found = true;
                        tempRole = r;
                        break;
                    }
                }

                if (!found) {
                    let t = new Role(role.name, role.id, `#${role.color.toString(16).toUpperCase()}`);
                    allRoles.push(t);
                    tempRole = t;

                }
                let div = document.createElement("div");
                div.classList.add("role");
                let p = document.createElement("p");
                p.textContent = tempRole.name;
                p.style.color = tempRole.color;
                div.appendChild(p);
                let p2 = document.createElement("p");
                p2.textContent = tempRole.id;
                p2.style.color = tempRole.color;
                div.appendChild(p2);
                rolesDiv.appendChild(div);

                div.addEventListener("click", () => {
                    if (currentRole) {
                        currentRole.div.style.backgroundColor = "var(--interaction)";
                    }
                    currentRole = { role: role, div: div };
                    let c = getComputedStyle(guildSelect).getPropertyValue('--interaction');
                    div.style.backgroundColor = adjustBrightness(c, 0.5);
                })
            }
        })

        selectionArea.appendChild(div);
    }
})

modAddBtn.addEventListener("click", async () => {
    let added = await window.api.invoke("AddModRole", currentRole.role);
    if (added) {
        // Valid
        let div = document.createElement('div');
        div.classList.add("roleTag");
        let a = document.createElement("a");
        a.textContent = "X";
        let id = currentRole.role.id;
        a.addEventListener("click", () => {
            window.api.send("RemoveModRole", id);
            div.remove();
        })
        div.appendChild(a);
        let p = document.createElement("p");
        p.textContent = currentRole.role.name;
        div.appendChild(p);
        modRoleDisplay.appendChild(div);
    }
})


ownerAddBtn.addEventListener("click", async () => {
    let added = await window.api.invoke("AddOwnerRole", currentRole.role);
    if (added) {
        // Valid
        let div = document.createElement('div');
        div.classList.add("roleTag");
        let a = document.createElement("a");
        a.textContent = "X";
        let id = currentRole.role.id;
        a.addEventListener("click", () => {
            window.api.send("RemoveOwnerRole", id);
            div.remove();
        })
        div.appendChild(a);
        let p = document.createElement("p");
        p.textContent = currentRole.role.name;
        div.appendChild(p);
        ownerRoleDisplay.appendChild(div);
    }
})

//GetPermissions

let c = adjustBrightness(getComputedStyle(document.documentElement).getPropertyValue('--interaction'), 0.5);
document.documentElement.style.setProperty('--add-bg', c);

const permsMain = async () => {
    let permissions = await window.api.invoke("GetPermissions");
    for (let role of permissions.moderator) {
        let div = document.createElement('div');
        div.classList.add("roleTag");
        let a = document.createElement("a");
        a.textContent = "X";
        let id = role.id;
        a.addEventListener("click", () => {
            window.api.send("RemoveModRole", id);
            div.remove();
        })
        div.appendChild(a);
        let p = document.createElement("p");
        p.textContent = role.name;
        div.appendChild(p);
        modRoleDisplay.appendChild(div);
    }

    for (let role of permissions.owner) {
        let div = document.createElement('div');
        div.classList.add("roleTag");
        let a = document.createElement("a");
        a.textContent = "X";
        let id = role.id;
        a.addEventListener("click", () => {
            window.api.send("RemoveOwnerRole", id);
            div.remove();
        })
        div.appendChild(a);
        let p = document.createElement("p");
        p.textContent = role.name;
        div.appendChild(p);
        ownerRoleDisplay.appendChild(div);
    }
}

permsMain();