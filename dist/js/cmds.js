const container = document.getElementById("container");

let everyone = 0;
let moderators = 1;
let owner = 2;

let levels = [
    { name: "everyone", value: 0 },
    { name: "moderators", value: 1 },
    { name: "owner", value: 2 },
]

function getLevelName(v) {
    for (let level of levels) {
        if (level.value == v) {
            return level.name;
        }
    }
    return "ERROR";
}

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

async function main() {
    let commands = await window.api.invoke("commandList", null);
    commands.forEach((command) => {
        let n = command[0];
        let adminLevel = command[1];
        let div = document.createElement("div");
        div.classList.add("command");
        let name = document.createElement("p");
        name.textContent = n;
        div.appendChild(name);
        let desc = document.createElement("p");
        desc.textContent = command[2];
        let aL = document.createElement("p");
        aL.id = "adminLevel"
        aL.textContent = getLevelName(adminLevel).toUpperCase();
        aL.style.color = adjustBrightness(getComputedStyle(container).getPropertyValue('--text'), 0.8);
        div.appendChild(aL);
        div.appendChild(desc);
        container.appendChild(div);
    })
}

main();