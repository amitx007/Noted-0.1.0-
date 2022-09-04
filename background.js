chrome.tabs.onUpdated.addListener((tabId, tab) => {
  // chrome.storage.sync.clear();
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
    });
  }
});
