var K_KEY_CODE = 75,
    L_KEY_CODE = 76

var get_parser = function (url) {
  var parser = document.createElement('a');
  parser.href = document.URL
  return parser
}

var generate_uuid = function() {
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
  return uuid
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

var display_flash = function (text) {
  $('body').append(
    $('<span></span>')
      .css('position', 'fixed')
      .css('top', 0)
      .css('left', 0)
      .css('width', '100%')
      .css('background', '#ecf0f1')
      .css('text-align', 'center')
      .css('height', '30px')
      .css('line-height', '30px')
      .text(text)
      .fadeIn(1000)
      .fadeOut(1000)
    );
}