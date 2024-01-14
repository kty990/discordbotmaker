const twitch = document.getElementById("twitch-controls");
const tChannel = document.getElementById("channelname");
const tChannel_check = document.getElementById("tcheck"); // Twitch channel check
const dChannel_check = document.getElementById("dcheck"); // Discord channel check
const t_channelID = document.getElementById("channelid");
const t_enabled = document.getElementById("enabled");

const enabled_color = getComputedStyle(t_enabled).getPropertyValue('--enabled').toLowerCase();
const disabled_color = getComputedStyle(t_enabled).getPropertyValue('--disabled').toLowerCase();


function rgbToHex(red, green, blue) {
    // Ensure that the values are within the valid range (0-255)
    red = Math.max(0, Math.min(255, red));
    green = Math.max(0, Math.min(255, green));
    blue = Math.max(0, Math.min(255, blue));

    // Convert each component to a two-digit hexadecimal representation
    const redHex = red.toString(16).padStart(2, '0');
    const greenHex = green.toString(16).padStart(2, '0');
    const blueHex = blue.toString(16).padStart(2, '0');

    // Combine the hex values
    const hexCode = `#${redHex}${greenHex}${blueHex}`;

    return hexCode.toUpperCase(); // Convert to uppercase for consistency
}


tChannel_check.addEventListener("click", async () => {
    const result = await window.api.invoke("check-twitch-channel", tChannel.value);
    if (result) {
        // Display a checkmark
        console.log("YES");
    } else {
        // Display a message under the input field
        console.log("NO");
    }
})

dChannel_check.addEventListener("click", async () => {
    const result = await window.api.invoke("check-discord-channel", t_channelID.value);
    if (result) {
        // Display a checkmark
    } else {
        // Display a message under the input field
    }
})

t_enabled.addEventListener("click", () => {
    let deconstructed = t_enabled.style.backgroundColor.replace("rgb(", "").replace(")", "").replace(" ", "").split(",");
    let toHEX = rgbToHex(deconstructed[0], deconstructed[1], deconstructed[2]);
    if (toHEX.toLowerCase() == disabled_color) {
        t_enabled.style.backgroundColor = enabled_color;
    } else {
        t_enabled.style.backgroundColor = disabled_color;
    }
})
t_enabled.style.backgroundColor = disabled_color;