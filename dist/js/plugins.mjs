class Notification {
    static types = {
        info: null,
        error: "#7d0000",
        warning: "#e0982b",
        fatal: "#ff0000"
    }

    constructor(type = info) {
        this.type = type;
    }

    create(t = "Notification", description = "Something went wrong! Error Code: 500") {
        const notif = `<div class="notification">
    <div id="topbar"${(this.type !== Notification.types.info) ? `style="background-color:${this.type};"` : ''}>
        <p id="title">${t}</p>
        <p id="close-notif">X</p>
    </div>
    <p id="description-notif">${description}</p>
</div>`;
        return notif;
    }


}

try {
    let iscommand = document.getElementById("iscommandToggle");
    let iscommandP = iscommand.querySelector("p");
    let argsDiv = document.getElementById("argContainer");
    let argsDiv2 = document.getElementById("args");

    let newPlugin = document.getElementById("newPlugin");
    let savePlugin = document.getElementById("savePlugin");
    let pluginList = document.getElementById("pluginList");

    let codeArea = document.getElementById("codeBox");
    let pluginNameInput = document.getElementById("pluginName");
    let pluginDescInput = document.getElementById("description");

    var plugins = [];
    var currentPlugin = null;

    const showObject = (typeOfChange, obj) => {
        let s = `\n\n--- ${typeOfChange} Change ---\n\n`;
        for (const [key, value] of Object.entries(obj)) {
            s += `${key}\t${value}\n\n`
        }
        s += `--- ${typeOfChange} Change End ---\n\n`;
        return s;
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

    class MyPlugin {
        constructor(name, default_name, author, description, div, isCommand = true, code = "<TEST CODE>", executeFunction = () => { }, status = "Warning") {
            this.name = name;
            this.default_name = default_name;
            this.author = author;
            this.description = description;
            this.div = div;
            this.isCommand = isCommand;
            this.code = code;
            this.status = status;
            this.executeFunction = executeFunction;
        }

        send() {
            return {
                name: this.name,
                default_name: this.default_name || this.name,
                author: this.author,
                description: this.description,
                isCommand: this.isCommand,
                code: this.code,
                executeFunction: null,
                div: this.div.innerHTML,
                status: this.status
            }
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

    newPlugin.addEventListener("mouseenter", () => {
        let color = getComputedStyle(newPlugin).getPropertyValue('--interaction');
        newPlugin.style.backgroundColor = adjustBrightness(color, 0.5);
    })
    newPlugin.addEventListener("mouseleave", () => {
        newPlugin.style.backgroundColor = "var(--interaction)";
    })

    savePlugin.addEventListener("mouseenter", () => {
        let color = getComputedStyle(savePlugin).getPropertyValue('--interaction');
        savePlugin.style.backgroundColor = adjustBrightness(color, 0.5);
    })
    savePlugin.addEventListener("mouseleave", () => {
        savePlugin.style.backgroundColor = "var(--interaction)";
    })
    savePlugin.addEventListener("click", () => {
        currentPlugin.name = pluginNameInput.value;
        currentPlugin.description = pluginDescInput.value;
        currentPlugin.isCommand = (iscommandP.textContent != "X");
        currentPlugin.code = codeArea.value;
        OnPluginChange(currentPlugin);
        window.api.send("pluginChange", currentPlugin.send());
    })

    newPlugin.addEventListener("click", async () => {
        let n = await window.api.invoke("newPlugin");
        addPlugin(n);
    })

    function addPlugin(data) {
        if (data == undefined || data == null) {
            console.warn("Undefined plugin");
            return;
        }
        let name = data.name;
        let default_name = data.default_name;
        let author = data.author;
        let description = data.description || "";
        let isCommand = data.isCommand || true;
        let code = data.code || "";
        let executeFunction = () => {

        }
        let status = data.status;

        let div = document.createElement("div");
        div.classList.add("plugin");
        let plugin = new MyPlugin(name, default_name || name, author, description, div, isCommand, code, executeFunction, status);


        let p0 = document.createElement("p");
        let p1 = document.createElement("p");
        let p2 = document.createElement("p");
        p0.id = "name";
        p1.id = "author";
        p2.id = "status";

        p0.textContent = name;
        p1.textContent = author;
        p2.textContent = status;

        div.appendChild(p0);
        div.appendChild(p1);
        div.appendChild(p2);

        div.addEventListener("click", () => {
            OnPluginSelect(plugin);
        })

        pluginList.appendChild(div);

        plugins.push(plugin);

        OnPluginChange(plugin);
    }

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

    function OnPluginChange(data) {
        let name = data.name;
        let defaultName = data.default_name;
        let author = data.author;
        let div, plugin;
        for (let p of plugins) {
            if (p.default_name == defaultName) {
                div = p.div;
                plugin = p;
                break;
            }
        }

        try {
            div.querySelector("#status").textContent = data.status || "Warning";
            div.querySelector("#status").style.color = GetColorForStatus(div.querySelector("#status").textContent);

            div.querySelector("#name").textContent = name;
            div.querySelector("#author").textContent = author;
        } catch (e) {
            console.error(e);
        }

    }

    function OnPluginError(data) {
        let notif = new Notification(Notification.types.error);
        let element = notif.create("Error", `An error occured in plugin "${data.name}":\n\t${data.error}`);
        document.getElementById("notifications").appendChild(element);

        console.error(data);
    }

    function OnPluginSelect(plugin) {
        console.log(showObject("Jump Plugin", plugin));
        let name = plugin.name;
        let div = plugin.div;
        let description = plugin.description;
        let code = plugin.code;
        let isCommand = plugin.isCommand;
        codeArea.value = code;
        pluginNameInput.value = name;
        pluginDescInput.value = description;

        if (currentPlugin) {
            currentPlugin.div.style.backgroundColor = null;
        }
        currentPlugin = plugin;
        let color = getComputedStyle(div).getPropertyValue('--interaction');
        currentPlugin.div.style.backgroundColor = adjustBrightness(color, 1.5);


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

    window.api.on("pluginError", (data) => {
        OnPluginError(data);
    })

    window.api.on("set-plugins", plugins => {
        try {
            for (let plugin of plugins) {
                // console.log(`Attempt to set plugin ${Object.entries(plugin)}`);
                addPlugin(plugin.plugin);
            }
        } catch (e) {
            console.error(e);
        }
    })
} catch (e) {
    console.error(e);
}