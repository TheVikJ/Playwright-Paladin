// const findAllURL = text => {
//     const current = window.location.href;
//     if (current.startsWith(text)) {
//         document.documentElement.innerHTML = 'Domain is blocked';
//         document.documentElement.scrollTop = 0;
//     }
// }
//
// findAllURL("https://www.facebook.com/");
// findAllURL("https://www.instagram.com/");
// findAllURL("https://www.netflix.com/");
// findAllURL("https://www.youtube.com/");

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["blocked", "enabled"], function (local) {
        if (!Array.isArray(local.blocked)) {
            chrome.storage.local.set({ blocked: [] });
        }

        if (typeof local.enabled !== "boolean") {
            chrome.storage.local.set({ enabled: false });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const url = tab.pendingUrl || tab.url;
    console.log(url)
    if (!url || !url.startsWith("http")) {
        return;
    }

    const hostname = new URL(url).hostname;

    chrome.storage.local.get(["blocked", "enabled"], function (local) {
        const { blocked, enabled } = local;
        if (Array.isArray(blocked) && enabled && blocked.find(domain => hostname.includes(domain))) {
            chrome.tabs.executeScript(tabId, {
                file: 'blockpage.js'
            });
        }
    });
});