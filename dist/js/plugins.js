let iscommand = document.getElementById("iscommandToggle");
let iscommandP = iscommand.querySelector("p");
let argsDiv = document.getElementById("argContainer");
let argsDiv2 = document.getElementById("args");

let codeArea = document.getElementById("code").querySelector("input");
let pluginNameInput = document.getElementById("pluginName");
let pluginDescInput = document.getElementById("description");

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


let enabled = true;
iscommand.addEventListener("click", () => {
    enabled = !enabled;
    if (enabled) {
        iscommand.style.backgroundColor = "var(--interaction)";
        iscommandP.textContent = "✓";
        argsDiv.style.display = "flex";
        argsDiv2.style.display = "flex";
    } else {
        let color = getComputedStyle(iscommand).getPropertyValue('--interaction');
        iscommand.style.backgroundColor = adjustBrightness(color, 0.5);
        iscommandP.textContent = "X";
        argsDiv.style.display = "none";
        argsDiv2.style.display = "none";
    }
})

function GetColorForStatus(status) {
    switch (status.toLowerCase()) {
        case "running":
            return "#10ad12"
        case "warning":
            return "#d9ae21"
        case "error":
            return "#910000"
        case "disabled":
            return "#360000"
        case "info":
            return "#002336"
        default:
            return "#cccccc"
    }
}

function OnPluginChange(plugin) {
    let name = plugin.name;
    let author = plugin.author;
    let div = plugin.div;
    div.querySelector("#status").style.color = GetColorForStatus(div.querySelector("#status").textContent);
    div.querySelector("#name").textContent = name;
    div.querySelector("#author").textContent = author;
}

function OnPluginError(plugin, error) {

}

function OnPluginSelect(plugin) {
    let name = plugin.name;
    let author = plugin.author;
    let div = plugin.div;
    let description = plugin.description;
    let code = plugin.code;
    let isCommand = plugin.isCommand;
    codeArea.value = code;
    pluginNameInput.value = name;
    pluginDescInput.value = description;

    if (isCommand) {
        iscommand.style.backgroundColor = "var(--interaction)";
        iscommandP.textContent = "✓";
        argsDiv.style.display = "flex";
        argsDiv2.style.display = "flex";
    } else {
        let color = getComputedStyle(iscommand).getPropertyValue('--interaction');
        iscommand.style.backgroundColor = adjustBrightness(color, 0.5);
        iscommandP.textContent = "X";
        argsDiv.style.display = "none";
        argsDiv2.style.display = "none";
    }
}

class MyPlugin {
    constructor(name, author, description, div, isCommand = false, code = "<TEST CODE>", executeFunction = () => { }) {
        this.name = name;
        this.author = author;
        this.description = description;
        this.div = div;
        this.isCommand = isCommand;
        this.code = code;
        this.executeFunction = executeFunction;
    }
}

// Add the test plugin
let testPlugin = new MyPlugin("test plugin", "test author", "test description", document.getElementsByClassName("plugin")[0]);
OnPluginChange(testPlugin);
OnPluginSelect(testPlugin);