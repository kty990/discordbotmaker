const pink = "#c586c0";
const darkBlue = "#1f1f83";
const lightBlue = "#4fc1ff";
const yellow = "#c5c800";

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

class CodeBox {
    constructor(HTMLElement = null, lineNumbers = true, tabSpacing = 4) {
        this.element = HTMLElement;
        this.lineNumbers = lineNumbers;
        this.spacing = tabSpacing;
    }

    format() {
        let content = this.element.innerHTML;
        console.log("Content:", content);
        for (const [name, color] of Object.entries(javascriptKeywords)) {
            //`<span style="">{0}</span>`
            content = content.replace(name, `<span style="color:${color}">${name}</span>`);
        }
        this.element.innerHTML = content;
    }
}

const javascriptKeywords = {
    "(": yellow,
    ")": yellow,
    "{": yellow,
    "}": yellow,
    "[": yellow,
    "]": yellow,
    "await": pink,
    "break": pink,
    "case": pink,
    "catch": pink,
    "class": darkBlue,
    "const": darkBlue,
    "continue": pink,
    "debugger": darkBlue,
    "default": pink,
    "delete": darkBlue,
    "do": pink,
    "else": pink,
    "export": darkBlue,
    "false": darkBlue,
    "finally": pink,
    "for": pink,
    "function": darkBlue,
    "goto": pink,
    "if": pink,
    "import": pink,
    "in": darkBlue,
    "instanceof": darkBlue,
    "interface": darkBlue,
    "let": darkBlue,
    "new": darkBlue,
    "null": darkBlue,
    "package": pink,
    "return": pink,
    "static": darkBlue,
    "super": darkBlue,
    "switch": pink,
    "this": darkBlue,
    "throw": pink,
    "true": darkBlue,
    "try": pink,
    "typeof": darkBlue,
    "var": darkBlue,
    "void": darkBlue,
    "while": pink,
    "with": pink,
    "yield": pink,
};


const iscommand = document.getElementById("iscommandToggle");
const iscommandP = iscommand.querySelector("p");
const argsDiv = document.getElementById("argContainer");
const argsDiv2 = document.getElementById("args");

const newPlugin = document.getElementById("newPlugin");
const savePlugin = document.getElementById("savePlugin");
const deletePlugin = document.getElementById("deletePlugin");
const pluginList = document.getElementById("pluginList");
const disableBtn = document.getElementsByClassName("disableplugin")[0];
const enableBtn = document.getElementsByClassName("enableplugin")[0];
const importBtn = document.getElementsByClassName("importplugin")[0];
const exportBtn = document.getElementsByClassName("exportplugin")[0];

const eventSimple = document.getElementsByClassName("eventSimple")[0];
const discordSimple = document.getElementsByClassName("discordSimple")[0];
const storeSimple = document.getElementsByClassName("storeSimple")[0];
const simpleAttrs = document.getElementById("simple-attrs");

const argsContainer = document.getElementById("args");
const argUp = document.getElementById("argCountUp");
const argDown = document.getElementById("argCountDown");
const argCount = document.getElementById("argCountDisplay");

const codeArea = document.getElementById("codeBox");
const pluginNameInput = document.getElementById("pluginName");
const pluginDescInput = document.getElementById("description");

const discordJsEvents = [
    // Client Events
    'ready',
    'message',
    'messageDelete',
    'messageUpdate',
    'guildCreate',
    'guildDelete',

    // Message Events
    'messageReactionAdd',
    'messageReactionRemove',

    // User Events
    'userUpdate',
    'presenceUpdate',

    // Voice Events
    'voiceStateUpdate',

    // Role Events
    'guildMemberUpdate',

    // Channel Events
    'channelCreate',
    'channelDelete',
    'channelUpdate',

    // Guild Events
    'guildUpdate',
    'guildMemberAdd',
    'guildMemberRemove',
    'guildMemberUpdate',

    // Bot-specific Events
    'shardDisconnect',
    'shardReady',
    'warn'
];

var plugins = [];
var currentPlugin = null;
var numberOfArgs = 0;
var startOfSelection = 0;
var endOfSelection = 0;

const codeBox = new CodeBox(codeArea);

const showObject = (typeOfChange, obj) => {
    let s = `\n\n--- ${typeOfChange} Change ---\n\n`;
    for (const [key, value] of Object.entries(obj)) {
        s += `${key}\t\t${value}\n\n`
    }
    s += `--- ${typeOfChange} Change End ---\n\n`;
    return s;
}

function insertText(newText) {
    var currentText = codeArea.textContent;
    var newTextContent = currentText.substring(0, startOfSelection) + newText + currentText.substring(endOfSelection);
    codeArea.textContent = newTextContent;
    codeArea.setSelectionRange(startOfSelection + newText.length, startOfSelection + newText.length);
    updateSelection();
}

function updateSelection() {
    startOfSelection = codeArea.selectionStart;
    endOfSelection = codeArea.selectionEnd;
    // codeBox.format();
}

codeArea.addEventListener('input', updateSelection);
codeArea.addEventListener('mouseup', updateSelection);


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
    constructor(name, default_name, author, description, div, isCommand = true, code = "<TEST CODE>", executeFunction = () => { }, status = "Unknown") {
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

class CodeFormatter {
    constructor(textarea) {
        this.textarea = textarea;
        this.textarea.addEventListener("keyup", (event) => this.formatCode(event)); // Trigger on "change" event
    }

    formatCode(event) {
        const caretPosition = this.getCaretPosition(this.textarea);

        const text = this.textarea.textContent;
        const formattedText = this.applyFormatting(text);
        const formattedWithBracket = this.autoCompleteBrackets(formattedText);
        this.textarea.textContent = formattedWithBracket;

        this.setCaretPosition(this.textarea, caretPosition); // Restore cursor position
    }

    getCaretPosition(element) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            return preCaretRange.toString().length;
        } else {
            return 0;
        }
    }

    setCaretPosition(element, position) {
        const range = document.createRange();
        range.setStart(element, 0);
        range.setEnd(element, position);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }

    applyFormatting(text) {
        let formattedText = text
            .replace(/\t/g, "    ")
            .replace(/\n{3,}/g, "\n\n");

        const keywords = /\b(if|else|while|for|function|var|let|const|return|true|false|null|undefined)\b/g;

        // Prevent keyword highlighting loop
        formattedText = formattedText.replace(keywords, (match) => {
            if (!match.startsWith("<span class='keyword'>")) {
                return "<span class='keyword'>" + match + "</span>";
            }
            return match;
        });

        return formattedText;
    }

    autoCompleteBrackets(text) {
        if (text.endsWith("{") && !text.endsWith("\\{")) {
            return text + "\t\n}";
        }
        return text;
    }
}


// const formatter = new CodeFormatter(codeArea);

eventSimple.addEventListener("click", () => {
    simpleAttrs.innerHTML = "";
    for (let x of discordJsEvents) {
        let d = document.createElement("div");
        d.classList.add("attr");
        d.textContent = x;
        simpleAttrs.appendChild(d);
        d.addEventListener("click", () => {
            insertText(`client.on("${x}", (event) => {

})`)
        })
    }
})

discordSimple.addEventListener("click", async () => {
    simpleAttrs.innerHTML = "";
    let discordClasses = await window.api.invoke("getDiscordClasses");
    for (let x of discordClasses) {
        let d = document.createElement("div");
        d.classList.add("attr");
        d.textContent = x;
        simpleAttrs.appendChild(d);
        d.addEventListener("click", () => {
            insertText(`var variable_${++variables} = new ${x}();\n`);
        })
    }
})

storeSimple.addEventListener("click", async () => {
    simpleAttrs.innerHTML = "";
    let options = ['set', 'get'];
    for (let x of options) {
        let d = document.createElement("div");
        d.classList.add("attr");
        d.textContent = x;
        simpleAttrs.appendChild(d);
        d.addEventListener("click", () => {
            if (x == 'set') {
                insertText(`window.api.send("storage",${currentPlugin.name},"set",KEY,VALUE);\n`);
            } else {
                insertText(`var variable_${++variables} = await window.api.send("storage",${currentPlugin.name},"get",KEY);\n`);
            }
        })
    }
})

argUp.addEventListener("click", () => {
    if (!currentPlugin) return;
    numberOfArgs++;
    if (numberOfArgs > 5) {
        numberOfArgs = 5;
        return;
    }
    let mainDiv = document.createElement("div");
    mainDiv.classList.add("arg");

    let name = document.createElement("p");
    name.classList.add("argName");
    name.textContent = `${numberOfArgs}`;
    mainDiv.appendChild(name);

    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("argInput");
    mainDiv.appendChild(input);

    argsContainer.appendChild(mainDiv);

    argCount.textContent = `${numberOfArgs}`;
})

argDown.addEventListener("click", () => {
    if (!currentPlugin) return;
    numberOfArgs--;
    if (numberOfArgs < 0) {
        numberOfArgs = 0;
        return;
    }

    let children = Array.from(argsContainer.children);
    for (let child of children) {
        if (child.querySelector(".argName").textContent == numberOfArgs + 1) {
            child.remove();
            break;
        }
    }
    argCount.textContent = `${numberOfArgs}`;
})

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
    currentPlugin.code = codeArea.textContent;
    OnPluginChange(currentPlugin);
    window.api.send("pluginChange", currentPlugin.send());
})

deletePlugin.addEventListener("mouseenter", () => {
    let color = getComputedStyle(deletePlugin).getPropertyValue('--interaction');
    deletePlugin.style.backgroundColor = adjustBrightness(color, 0.5);
})
deletePlugin.addEventListener("mouseleave", () => {
    deletePlugin.style.backgroundColor = "var(--interaction)";
})

deletePlugin.addEventListener("click", () => {
    window.api.send("deleteCurrentPlugin", currentPlugin.default_name);
})

importBtn.addEventListener("click", () => {
    window.api.send("importPlugin");
})

exportBtn.addEventListener("click", () => {
    if (!currentPlugin) {
        window.api.send("exportPlugin");
        return;
    }
    window.api.send("exportPlugin", currentPlugin.default_name);
})

newPlugin.addEventListener("click", async () => {
    let n = await window.api.invoke("newPlugin");
    addPlugin(n);
})

disableBtn.addEventListener('click', () => {
    if (currentPlugin.status != "Error") {
        currentPlugin.status = "Disabled";
        OnPluginChange(currentPlugin);
        window.api.send("pluginChange", currentPlugin.send());
    }
})

enableBtn.addEventListener("click", () => {
    if (currentPlugin.status != "Running" && currentPlugin.status != "Warning") {
        currentPlugin.status = "Restart";
        OnPluginChange(currentPlugin);
        window.api.send("pluginChange", currentPlugin.send());
    }
})

function addPlugin(data) {
    if (data == undefined || data == null) {
        console.warn("Undefined plugin");
        return;
    }
    console.log("Data..");
    console.log(data);
    let name = data.name;
    let default_name = data.default_name;
    let author = data.author;
    let description = data.description || "";
    let isCommand = data.isCommand;
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
        case "restart":
            return "#ffa500 "
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
    codeArea.textContent = code;
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
    OnPluginChange(plugin);
}

window.api.on("pluginError", (data) => {
    OnPluginError(data);
})

window.api.on("set-plugins", plugins => {
    console.log(`Attempting to set plugins:`);
    console.log(plugins);
    let old_plugins = Array.from(document.getElementsByClassName("plugin"));
    for (let x of old_plugins) {
        x.remove();
    }
    try {
        for (let plugin of plugins) {
            // console.log(`Attempt to set plugin ${Object.entries(plugin)}`);
            addPlugin(plugin.plugin);
        }
    } catch (e) {
        console.error(e);
    }
})