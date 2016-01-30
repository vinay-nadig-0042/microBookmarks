chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  var scriptOptions = message.scriptOptions;
  $('body').animate({scrollTop: scriptOptions.scrollPos}, '500')
});