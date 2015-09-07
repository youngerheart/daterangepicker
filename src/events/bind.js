module.exports = function(e, events) {
  e.target.className.split(' ').forEach(function(item) {
    if(typeof events[item] === 'function') {
      events[item](e.target);
    }
  });
};