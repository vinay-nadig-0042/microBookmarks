function createAndScrollTab(bookmarkInstance) {
  chrome.tabs.create({ url: bookmarkInstance.url, active: true }, function (tab) {
    chrome.tabs.executeScript(tab.id, { file: 'scripts/jquery-2.2.0.min.js' }, function () {
      chrome.tabs.executeScript(tab.id, { file: 'scripts/scroller.js' }, function () {
        chrome.tabs.sendMessage(tab.id, { scriptOptions: { scrollPos: bookmarkInstance.pos } }, function () {})
      })
    })
  })
}

var deleteBookmarkCallback = function(linkId, instanceId, domainName, domainsObj) {
  savedInstance = _.find(domainsObj[domainName].saved_instances, function(savedInstance) {
    return savedInstance.uuid == instanceId
  })
  links = _.reject(savedInstance.links, function(link) {
    return link.uuid == linkId
  })
  savedInstance.links = links
  chrome.storage.sync.set(domainsObj, function () {
    $("tr[data-link-id='" + linkId + "']").remove()
  })
}

function deleteBookmark(linkId, instanceId, domainName) {
  chrome.storage.sync.get(null, deleteBookmarkCallback.bind(null, linkId, instanceId, domainName))
}

delteBookmarkCollectionCallback = function(instanceId, domainName, domainsObj) {
  savedInstances = _.reject(domainsObj[domainName].savedInstances, function(savedInstance) {
    return savedInstance.uuid == instanceId
  })
  domainsObj[domainName].saved_instances = savedInstances;
  chrome.storage.sync.set(domainsObj, function () {
    $("tr[data-bookmark-instance-id='" + instanceId + "']").remove()
  })
}

function deleteCollection(instanceId, domainName) {
  chrome.storage.sync.get(null, delteBookmarkCollectionCallback.bind(null, instanceId, domainName))
}

chrome.storage.sync.get(null, function (domainsObj) {
  $.each(domainsObj, function (domainName, domain) {
    $.each(domain['saved_instances'], function (j, bookmarkInstance) {
      $.each(bookmarkInstance['links'], function (k, elem) {
        var row = $('#dummy-table tbody tr')
          .clone()

        row.attr('data-link-id', elem.uuid)
        row.attr('data-bookmark-instance-id', bookmarkInstance.uuid)

        if (k == 0) {
          row.find('.domain-name')
            .append(
              $('<a></a>')
              .attr('href', bookmarkInstance.host_url)
              .text(domainName))
        }

        row.find('.link-text')
          .append(
            $('<a></a>')
            .attr('href', bookmarkInstance.url + '#' + elem.id)
            .attr('target', '_blank')
            .text(elem.text || s.titleize(s.humanize(elem.id).replace(/[0-9]/g, ''))))

        row.find('.page-position')
          .append(
            $('<a></a>')
            .attr('href', '#')
            .text(bookmarkInstance.pos)
            .on('click', function () {
              createAndScrollTab(bookmarkInstance)
            }))

        row.find('.save-time')
          .append(moment(bookmarkInstance.time).fromNow());

        row.find('.delete-link')
          .append(
            $('<a></a>')
            .attr('href', '#')
            .text('Delete')
            .on('click', function() {
              bookmarkId = $(this).closest('tr').data('link-id')
              instanceId = $(this).closest('tr').data('bookmark-instance-id')
              deleteBookmark(bookmarkId, instanceId, domainName)
            }))

        if (k == 0) {
          row.find('.delete-instance')
            .append(
              $('<a></a>')
              .attr('href', '#')
              .text('Delete Collection')
              .on('click', function() {
                var instanceId = $(this).closest('tr').data('bookmark-instance-id')
                deleteCollection(instanceId, domainName)
              }))
        }

        $('#links-list tbody')
          .append(row.show())
      })
    })
  })
})