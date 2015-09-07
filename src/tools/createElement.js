module.exports = function(tagName, className, innerText) {
  var element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (innerText) {
    element.innderText = element.textContent = innerText;
  }
  return element;
};