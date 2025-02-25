document.addEventListener("DOMContentLoaded", function () {
    const intervalInput = document.getElementById("interval");
    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");

    chrome.storage.local.get(["delay", "isActive"], (data) => {
        if (data.delay) intervalInput.value = data.delay;
        if (data.isActive) {
            if (data.isActive) {
                startButton.classList.add("inactive");
                stopButton.classList.remove("inactive");
            } else {
                stopButton.classList.add("inactive");
                startButton.classList.remove("inactive");
            }
        }
    });

    startButton.addEventListener("click", function () {
        const delay = parseInt(intervalInput.value);
        chrome.runtime.sendMessage({ action: "setInterval", delay });
        chrome.runtime.sendMessage({ action: "toggleLoop", isActive: true });
        startButton.classList.add("inactive");
        stopButton.classList.remove("inactive");
        chrome.storage.local.set({ isActive: true });
    });

    stopButton.addEventListener("click", function () {
        chrome.runtime.sendMessage({ action: "toggleLoop", isActive: false });
        stopButton.classList.add("inactive");
        startButton.classList.remove("inactive");
        chrome.storage.local.set({ isActive: false });
    });
});
