var K_KEY_CODE = 75,
    L_KEY_CODE = 76

var get_parser = function (url) {
  var parser = document.createElement('a');
  parser.href = document.URL
  return parser
}

isElementInViewport = function (el) {

  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }

  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

var handleKeyDown = function (e) {
  var ctrlKey = e.ctrlKey || e.metaKey;
  var shiftKey = e.shiftKey;
  if (e.keyCode === K_KEY_CODE && ctrlKey && shiftKey) {
    parser = get_parser(document.URL)
    host_name = parser.hostname
    chrome.storage.sync.get(host_name, function (bmObjFromStorage) {
      var bmObj = bmObjFromStorage || {},
        currScrollPos = document.body.scrollTop,
        visibleElements = [],
        anchorElements = [],
        timeNow = new Date,
        currURLParser = get_parser(document.URL)

      if (bmObj[host_name] === undefined) {
        bmObj[host_name] = {
          saved_instances: []
        }
      }

      conditionalIndex = 0
      $('body')
        .find('*')
        .not('a')
        .each(function () {
          if (isElementInViewport($(this)) && $(this).is(':visible') && $(this)[0].id != '' && !($(this).closest('div').css('position') == 'fixed')) {
            conditionalIndex += 1
            if(conditionalIndex >= 3) {
              return false
            }
            visibleElements.push($(this)[0])
          }
        })

      $.each(visibleElements, function (index, elem) {
        if (elem.href === "") {
          return true
        }
        anchorElements.push({
          id: elem.id,
          text: elem.text
        })
      })

      bmObj[host_name]['saved_instances'].push({
        url: currURLParser.protocol + '//' + currURLParser.host + currURLParser.pathname + currURLParser.search,
        host_url: currURLParser.protocol + '//' + currURLParser.host,
        time: timeNow.toJSON(),
        links: anchorElements,
        pos: currScrollPos
      })

      chrome.storage.sync.set(bmObj)
    })
  } else if (e.keyCode === L_KEY_CODE && ctrlKey && shiftKey) {
    chrome.runtime.sendMessage("options-tab")
  }
}

document.addEventListener('keydown', handleKeyDown);
