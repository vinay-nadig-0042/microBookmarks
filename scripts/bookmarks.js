function create_and_scroll_tab(bookmark_instance) {
  chrome.tabs.create({ url: bookmark_instance.url, active: true }, function (tab) {
    chrome.tabs.executeScript(tab.id, { file: 'scripts/jquery-2.2.0.min.js' }, function () {
      chrome.tabs.executeScript(tab.id, { file: 'scripts/scroller.js' }, function () {
        chrome.tabs.sendMessage(tab.id, { scriptOptions: { scrollPos: bookmark_instance.pos } }, function () {})
      })
    })
  })
}

var getStorageCallback = function(link_id, saved_instance_id, domain_name, domains) {
  saved_instance = _.find(domains[domain_name].saved_instances, function(saved_instance) {
    return saved_instance.uuid == saved_instance_id
  })
  links = _.reject(saved_instance.links, function(link) {
    return link.uuid == link_id
  })
  saved_instance.links = links
  chrome.storage.sync.set(domains, function () {
    $("tr[data-link-id='" + link_id + "']").remove()
  })
}

function delete_bookmark(link_id, saved_instance_id, domain_name) {
  chrome.storage.sync.get(null, getStorageCallback.bind(null, link_id, saved_instance_id, domain_name))
}

chrome.storage.sync.get(null, function (domains) {
  $.each(domains, function (domain_name, domain) {
    $.each(domain['saved_instances'], function (j, bookmark_instance) {
      $.each(bookmark_instance['links'], function (k, elem) {
        var row = $('#dummy-table tbody tr')
          .clone()

        row.attr('data-link-id', elem.uuid)
        row.attr('data-bookmark-instance-id', bookmark_instance.uuid)

        if (k == 0) {
          row.find('.domain-name')
            .append(
              $('<a></a>')
              .attr('href', bookmark_instance.host_url)
              .text(domain_name))
        }

        row.find('.link-text')
          .append(
            $('<a></a>')
            .attr('href', bookmark_instance.url + '#' + elem.id)
            .attr('target', '_blank')
            .text(elem.text || s.humanize(elem.id)))

        row.find('.page-position')
          .append(
            $('<a></a>')
            .attr('href', '#')
            .text(bookmark_instance.pos)
            .on('click', function () {
              create_and_scroll_tab(bookmark_instance)
            }))

        row.find('.save-time')
          .append(bookmark_instance.time)

        row.find('.action-item')
          .append(
            $('<a></a>')
            .attr('href', '#')
            .text('Delete')
            .on('click', function() {
              bookmarkId = $(this).closest('tr').data('link-id')
              instanceId = $(this).closest('tr').data('bookmark-instance-id')
              delete_bookmark(bookmarkId, instanceId, domain_name)
            }))

        $('#links-list tbody')
          .append(row.show())
      })
    })
  })
})