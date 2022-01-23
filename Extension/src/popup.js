// const textarea = document.getElementById("textarea");
// const save = document.getElementById("save");
// const checkbox = document.getElementById("checkbox");
const startButton = document.getElementById("start");

// save.addEventListener("click", () => {
// const blocked = textarea.value.split("\n").map(s => s.trim()).filter(Boolean);
// chrome.storage.local.set({ blocked });
// });

// checkbox.addEventListener("change", (event) => {
// const enabled = event.target.checked;
// chrome.storage.local.set({ enabled });
// });

let isWriting = false;

const stoppedClassName = "text-emerald-500 hover:bg-emerald-500 hover:text-emerald-100".split(' ')
const runningClassName = "text-emerald-100 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-400/30".split(' ')

const setButtonClass = () => {
    if (isWriting) {
        runningClassName.forEach(x => {
            startButton.classList.add(x)
        })
        stoppedClassName.forEach(x => {
            startButton.classList.remove(x)
        })
        startButton.innerText = "Exit Writing Mode"
    } else {
        runningClassName.forEach(x => {
            startButton.classList.remove(x)
        })
        stoppedClassName.forEach(x => {
            startButton.classList.add(x)
        })
        startButton.innerText = "Enter Writing Mode"
    }
}

startButton.onclick = (event) => {
    chrome.storage.sync.set({isWriting: !isWriting})
}

chrome.storage.onChanged.addListener(function (changes) {
    if (!changes.isWriting) {
        return;
    }
    isWriting = changes.isWriting.newValue;

    setButtonClass()
});

window.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["blocked", "isWriting"], (local) => {
        const {blocked, isWriting: writing} = local;
        isWriting = writing;
        setButtonClass()

        if (Array.isArray(blocked)) {
            textarea.value = blocked.join("\n");
        }
    });
});