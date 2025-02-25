let interval = null;
let delay = 5; // Default delay in seconds
let isActive = false;

chrome.storage.local.get(["delay", "isActive"], (data) => {
    if (data.delay) delay = data.delay;
    if (data.isActive) {
        isActive = data.isActive;
        if (isActive) startLoop();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setInterval") {
        delay = message.delay;
        chrome.storage.local.set({ delay });
    } else if (message.action === "toggleLoop") {
        isActive = message.isActive;
        chrome.storage.local.set({ isActive });
        if (isActive) {
            startLoop();
        } else {
            stopLoop();
        }
    }
    sendResponse({ status: "updated" });
});

function startLoop() {
    if (interval) clearInterval(interval);
    interval = setInterval(switchTab, delay * 1000);
}

function stopLoop() {
    if (interval) clearInterval(interval);
}

function switchTab() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
        if (tabs.length < 2) return;
        
        chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
            let currentIndex = tabs.findIndex(tab => tab.id === activeTabs[0].id);
            let nextIndex = (currentIndex + 1) % tabs.length;
            chrome.tabs.update(tabs[nextIndex].id, { active: true });
        });
    });
}