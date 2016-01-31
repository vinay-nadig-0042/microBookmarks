// When action icon is clicked
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({url: chrome.extension.getURL("bookmarks.html")});
});

// When Keyboard Shortcut is triggered
chrome.runtime.onMessage.addListener(function (message) {
  if(message == "options-tab") {
    chrome.tabs.create({url: chrome.extension.getURL("bookmarks.html")});
  }
});