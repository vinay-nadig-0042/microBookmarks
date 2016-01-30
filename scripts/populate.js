function create_and_scroll_tab(instance) {
  chrome.tabs.create({ url: instance.url, active: true }, function (tab) {
    chrome.tabs.executeScript(tab.id, { file: 'jquery-2.2.0.min.js' }, function () {
      chrome.tabs.executeScript(tab.id, { file: 'scroller.js' }, function () {
        chrome.tabs.sendMessage(tab.id, { scriptOptions: { scrollPos: instance.pos } }, function () {})
      })
    })
  })
}

chrome.storage.sync.get(null, function (domains) {
  $.each(domains, function (domain_name, domain) {
    $.each(domain['saved_instances'], function (j, instance) {
      $.each(instance['links'], function (k, elem) {
        var row = $('#dummy-table tbody tr')
          .clone()

        if (j == 0) {
          row.find('.domain-name')
            .append(
              $('<a></a>')
              .attr('href', instance.host_url)
              .attr('target', '_blank')
              .text(domain_name))
        }

        row.find('.link-text')
          .append(
            $('<a></a>')
            .attr('href', instance.url + '#' + elem.id)
            .text(elem.text || s.humanize(elem.id)))

        if (j == 0) {
          row.find('.page-position')
            .append(
              $('<a></a>')
              .attr('href', '#')
              .text(instance.pos)
              .on('click', function () {
                create_and_scroll_tab(instance)
              }))
        }

        row.find('.save-time')
          .append(instance.time)

        $('#links-list tbody')
          .append(row.show())
      })
    })
  })
})