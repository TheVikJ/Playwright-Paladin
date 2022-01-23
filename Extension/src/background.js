chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["blocked"], function (local) {
        if (!Array.isArray(local.blocked)) {
            chrome.storage.sync.set({ blocked: [] });
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

    chrome.storage.sync.get(["blocked", "isWriting"], function (local) {
        const { blocked, isWriting } = local;
        console.log(local)
        if (Array.isArray(blocked) && isWriting && blocked.find(domain => hostname.includes(domain))) {
            chrome.tabs.executeScript(tabId, {
                file: 'blockpage.js'
            });
        }
    });
});