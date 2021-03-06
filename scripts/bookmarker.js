var saveBookmarks = function () {
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
        // Only select elements within viewport, elements with id, skip elements with fixed position(navbars, menus etc)
        if (isElementInViewport($(this)) && $(this).is(':visible') && $(this)[0].id != '' && !($(this).closest('div').css('position') == 'fixed')) {
          conditionalIndex += 1
          if(conditionalIndex >= 3) { // Only save two bookmarks
            return false
          }
          visibleElements.push($(this)[0])
        }
      })

    $.each(visibleElements, function (index, elem) {
      anchorElements.push({
        id: elem.id,
        text: elem.text,
        uuid: generate_uuid()
      })
    })

    bmObj[host_name]['saved_instances'].push({
      url: currURLParser.protocol + '//' + currURLParser.host + currURLParser.pathname + currURLParser.search,
      host_url: currURLParser.protocol + '//' + currURLParser.host,
      time: timeNow.toJSON(),
      links: anchorElements,
      pos: currScrollPos,
      uuid: generate_uuid()
    })

    chrome.storage.sync.set(bmObj, function() {
      display_flash('Bookmark Saved')
    })
  })
}

var handleKeyDown = function (e) {
  var ctrlKey = e.ctrlKey || e.metaKey;
  var shiftKey = e.shiftKey;
  if (e.keyCode === K_KEY_CODE && ctrlKey && shiftKey) {
    saveBookmarks()
  } else if (e.keyCode === L_KEY_CODE && ctrlKey && shiftKey) {
    chrome.runtime.sendMessage("options-tab")
  }
}

document.addEventListener('keydown', handleKeyDown);
