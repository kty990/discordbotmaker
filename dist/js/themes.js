/**
 * <input placeholder="Background Color" id="bg">
        <input placeholder="Menu Color" id="mc">
        <input placeholder="Interactable Color" id="ic">
        <input placeholder="Text Color" id="tc">
        <input placeholder="Text Color (On Hover)" id="th">
        <input placeholder="Active Menu Color" id="am">
        <input placeholder="Border Color" , id="bc">
 */

let bg = document.getElementById("bg")
let mc = document.getElementById("mc")
let ic = document.getElementById("ic")
let tc = document.getElementById("tc")
let th = document.getElementById("th")
let am = document.getElementById("am")
let bc = document.getElementById("bc")

let submit = document.getElementById("submit");
let neW = document.getElementById("new");

let form = document.getElementById("theme-list");

let themes = [];

let active_theme = null;

window.api.receive("list-of-themes", (list) => {
    console.log(list);
    themes = list;
    for (let i = 0; i < list.length; i++) {
        let theme = list[i];
        let p = document.createElement("p");
        p.textContent = `${theme.name}\n\t- ${theme.notes.join("\t\n- ")}`;
        p.classList.add("theme");
        let element = document.getElementById("theme-list");
        element.appendChild(p);
        p.addEventListener("click", () => {
            active_theme = theme.name;
            bg.value = theme.body.toUpperCase();
            mc.value = theme.menu.toUpperCase();
            ic.value = theme.interaction.toUpperCase();
            tc.value = theme.text.toUpperCase();
            th.value = theme['text-hover'].toUpperCase();
            am.value = theme.active.toUpperCase();
            bc.value = theme.border.toUpperCase();
        })
    }
});

const clearForm = () => {
    return new Promise((resolve, reject) => {
        let themes = document.getElementsByClassName("theme");
        for (let x = 0; x < themes.length; x++) {
            themes[x].remove();
        }
        resolve();
    })
}

neW.addEventListener("click", async () => {
    await clearForm();
    window.api.send("newTheme", null); // this could be invoked rather than send and once
    window.api.once("newTheme", (data) => {
        window.api.send("redirect", null);
    })
})

submit.addEventListener("click", () => {
    if (active_theme != null) {
        window.api.send("modTheme", [
            active_theme,
            bg.value,
            mc.value,
            ic.value,
            tc.value,
            th.value,
            am.value,
            bc.value
        ])
    }
})
