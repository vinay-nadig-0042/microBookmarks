chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({url: chrome.extension.getURL("bookmarks.html")});
});

chrome.runtime.onMessage.addListener(function (message) {
  if(message == "options-tab") {
    chrome.tabs.create({url: chrome.extension.getURL("bookmarks.html")});
  }
});