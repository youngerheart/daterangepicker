(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DateRangePicker"] = factory();
	else
		root["DateRangePicker"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	__webpack_require__(1);
	var Calendar = __webpack_require__(5);
	var TimePicker = __webpack_require__(9);
	var Shortcuts = __webpack_require__(10);
	var Dimension = __webpack_require__(12);
	var bind = __webpack_require__(13);

	var _require = __webpack_require__(14);

	var click = _require.click;
	var hover = _require.hover;
	var reload = _require.reload;
	var leave = _require.leave;

	var leaveEvent = __webpack_require__(15);
	var EL = __webpack_require__(6);

	var _require2 = __webpack_require__(8);

	var zero = _require2.zero;

	var DateRangePicker = (function () {
	  function DateRangePicker(el, config) {
	    var _this = this;

	    _classCallCheck(this, DateRangePicker);

	    var type = config.type;
	    var date = config.date;
	    var range = config.range;
	    var onSelect = config.onSelect;
	    var lang = config.lang;
	    var shortcuts = config.shortcuts;
	    var dimension = config.dimension;

	    config.lang = lang = lang || 'zh-cn';
	    // 保留有用的信息
	    this.el = el;
	    this.config = config;
	    this.targetElements = []; // single时储存的点击元素
	    this.rangeElements = [[], [], []]; // range，terminal时储存的元素
	    this.firstItem = null;
	    this.range = range ? (function () {
	      range.start = range.start.locale(lang);
	      range.end = range.end.locale(lang);
	      return range;
	    })() : null;
	    this.date = date ? date.locale(lang) : null;
	    this.interval = null;
	    this.time = null;
	    this.calendar = null;

	    // 绑定shortcuts
	    if (shortcuts && shortcuts.el) {
	      this.shortcuts = new Shortcuts(this, shortcuts);
	    }

	    // 绑定dimension
	    if (dimension && dimension.el && type === 'terminal') {
	      this.dimension = new Dimension(this, shortcuts);
	    }

	    this.selectFunc = onSelect ? function (date) {
	      if (type === 'single') {
	        date = date || _this.date;
	        if (_this.shortcuts) _this.shortcuts.setInput(type, date);
	        if (!_this.time) return onSelect(date);
	        var _time = _this.time;
	        var hours = _time.hours;
	        var minutes = _time.minutes;

	        _this.date = date.hours(hours[0]).minutes(minutes[0]);
	        onSelect(_this.date);
	      } else if (type === 'range' || type === 'terminal') {
	        date = date || _this.range;
	        if (_this.shortcuts) _this.shortcuts.setInput(type, date);
	        if (!_this.time) return onSelect(date);
	        var _time2 = _this.time;
	        var hours = _time2.hours;
	        var minutes = _time2.minutes;

	        _this.range.start = date.start.hours(hours[0]).minutes(minutes[0]);
	        _this.range.end = date.end.hours(hours[1]).minutes(minutes[1]);
	        onSelect(_this.range);
	      }
	    } : null;
	    this.init();
	  }

	  _createClass(DateRangePicker, [{
	    key: 'init',
	    value: function init() {
	      var _this2 = this;

	      // 绘制Calendar
	      var el = this.el;
	      var config = this.config;

	      this.calendar = new Calendar(this, function () {
	        reload(_this2);
	      });

	      if (config.time) this.time = new TimePicker(this);

	      el.className = 'drp';
	      el.addEventListener('click', function (e) {
	        bind(e, click, _this2);
	      });
	      el.addEventListener('mouseover', function (e) {
	        bind(e, hover, _this2);
	        if (!leaveEvent.getTarget(el)) leaveEvent.setTarget(el);
	      });
	      leaveEvent.add(el, function () {
	        leave(_this2);
	      });

	      reload(this, true);
	    }

	    // 动态设置值的接口

	  }, {
	    key: 'set',
	    value: function set(key, value) {
	      if (typeof this[key] === 'undefined' || !value) return;
	      var _config = this.config;
	      var type = _config.type;
	      var lang = _config.lang;

	      if (key === 'date') {
	        if (this.date && this.date.isSame(value)) return;
	        value = value.locale(lang);
	        if (this.shortcuts) this.shortcuts.setInput(type, value);
	      } else if (key === 'range' || type === 'terminal') {
	        if (this.range && this.range.isSame(value)) return;
	        value.start = value.start.locale(lang);
	        value.end = value.end.locale(lang);
	        if (type === 'terminal') {
	          this.interval = value.diff('days');
	        }
	        if (this.shortcuts) this.shortcuts.setInput(type, value);
	      }
	      this[key] = value;
	      if (this.time) this.time.setTime(value);
	      this.calendar.draw(value.start || value);
	      reload(this);
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      var el = this.el;
	      var date = this.date;
	      var range = this.range;
	      var config = this.config;

	      if (range) {
	        EL.clear(el, range);
	        this.range = null;
	        if (this.time) this.time.setTime(moment.range([zero, zero]));
	      }
	      if (date) {
	        EL.exchangeClass(this.targetElements, '', el, ['focus']);
	        this.date = null;
	        if (this.time) this.time.setTime(moment(zero));
	      }
	    }
	  }]);

	  return DateRangePicker;
	})();

	if (window) window.DateRangePicker = DateRangePicker;
	module.exports = DateRangePicker;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!!./main.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".drp {\n  width: 360px;\n  display: block;\n  overflow: hidden;\n  box-sizing: border-box;\n  display: inline-block;\n  position: relative;\n  -webkit-user-select: none; }\n\n.drp-header {\n  line-height: 32px;\n  text-align: center;\n  margin-bottom: 10px;\n  font-weight: bold; }\n\n.drp-month {\n  opacity: 1;\n  text-align: center;\n  margin-bottom: 0px;\n  font-weight: bold; }\n\n.drp-year {\n  text-align: center;\n  padding: 0px 40px;\n  font-size: 1.5em; }\n\n.drp-left, .drp-right {\n  position: absolute;\n  top: 1px;\n  height: 30px;\n  width: 30px;\n  cursor: pointer; }\n  .drp-left:hover, .drp-right:hover {\n    background-color: #eee; }\n\n.drp-left {\n  left: 30px; }\n\n.drp-right {\n  right: 32px; }\n\n.drp-left:after, .drp-right:after {\n  position: absolute;\n  content: ' ';\n  width: 0px;\n  height: 0px;\n  border-style: solid;\n  top: 50%;\n  margin-top: -7.5px;\n  top: 15px; }\n\n.drp-left:after {\n  border-width: 7.5px 10px 7.5px 0;\n  border-color: transparent #ccc transparent transparent;\n  left: 9px; }\n\n.drp-right:after {\n  border-width: 7.5px 0 7.5px 10px;\n  border-color: transparent transparent transparent #ccc;\n  right: 9px; }\n\n.drp-week-days {\n  text-align: center;\n  font-weight: bold; }\n\n.drp-day {\n  display: inline-block;\n  width: 44px;\n  height: 36px;\n  text-align: center;\n  vertical-align: top;\n  position: relative; }\n\n.drp-day-number, .drp-day-static {\n  position: absolute;\n  -webkit-user-select: none;\n  top: 5px;\n  left: 0;\n  line-height: 26px;\n  width: 44px; }\n\n.drp-day-static {\n  color: #999; }\n\n.drp-day-number {\n  border-radius: 3px;\n  cursor: pointer; }\n  .drp-day-number.hover, .drp-day-number:hover {\n    background-color: #eee; }\n  .drp-day-number.focus.start, .drp-day-number.active.start {\n    border-top-right-radius: 0;\n    border-bottom-right-radius: 0; }\n  .drp-day-number.focus.segment, .drp-day-number.active.segment {\n    left: 0;\n    width: 44px;\n    border-radius: 0; }\n  .drp-day-number.focus.end, .drp-day-number.active.end {\n    border-top-left-radius: 0;\n    border-bottom-left-radius: 0; }\n  .drp-day-number.focus.start.end, .drp-day-number.active.start.end {\n    border-radius: 3px; }\n  .drp-day-number.active.focus.start.end {\n    border-radius: 0; }\n\n.drp-day.drp-other {\n  color: #e9e9e9; }\n  .drp-day.drp-other .drp-day-number.hover, .drp-day.drp-other .drp-day-number:hover, .drp-day.drp-other .drp-day-number.active, .drp-day.drp-other .drp-day-number.focus {\n    color: #fff; }\n  .drp-day.drp-other .drp-day-number.active, .drp-day.drp-other .drp-day-number.focus {\n    opacity: 0.7; }\n\n.drp-today {\n  color: #428bca;\n  font-weight: normal; }\n\n.drp-time {\n  text-align: center;\n  margin-top: 10px; }\n\n.drp-time-text {\n  font-weight: bold; }\n\n.drp-time-input {\n  width: 100px;\n  -webkit-appearance: none;\n  margin: 18px 2px; }\n  .drp-time-input:focus {\n    outline: none; }\n  .drp-time-input::-webkit-slider-runnable-track {\n    height: 8.4px;\n    cursor: pointer;\n    animate: 0.2s;\n    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;\n    background: #3071a9;\n    border-radius: 1.3px;\n    border: 0.2px solid #010101; }\n  .drp-time-input::-webkit-slider-thumb {\n    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;\n    border: 1px solid #000000;\n    height: 26px;\n    width: 12px;\n    border-radius: 3px;\n    background: #ffffff;\n    cursor: pointer;\n    -webkit-appearance: none;\n    margin-top: -9px; }\n  .drp-time-input::-moz-range-track {\n    height: 8.4px;\n    cursor: pointer;\n    animate: 0.2s;\n    box-shadow: 1px 1px 1px #333, 0px 0px 1px #333;\n    background: #3071a9;\n    border-radius: 1.3px;\n    border: 0.2px solid #010101; }\n  .drp-time-input::-moz-range-thumb {\n    box-shadow: 1px 1px 1px #333, 0px 0px 1px #333;\n    border: 1px solid #000000;\n    height: 26px;\n    width: 12px;\n    border-radius: 3px;\n    background: #ffffff;\n    cursor: pointer; }\n  .drp-time-input::-ms-track {\n    height: 8.4px;\n    cursor: pointer;\n    animate: 0.2s;\n    background: transparent;\n    border-color: transparent;\n    border-width: 16px 0;\n    color: transparent; }\n  .drp-time-input::-ms-fill-lower {\n    background: #2a6495;\n    border: 0.2px solid #010101;\n    border-radius: 2.6px;\n    box-shadow: 1px 1px 1px #333, 0px 0px 1px #333; }\n  .drp-time-input::-ms-fill-upper {\n    background: #3071a9;\n    border: 0.2px solid #010101;\n    border-radius: 2.6px;\n    box-shadow: 1px 1px 1px #333, 0px 0px 1px #333; }\n  .drp-time-input::-ms-thumb {\n    box-shadow: 1px 1px 1px #333, 0px 0px 1px #333;\n    border: 1px solid #000000;\n    height: 26px;\n    width: 12px;\n    border-radius: 3px;\n    background: #ffffff;\n    cursor: pointer; }\n\n.drp-shortcuts-input {\n  line-height: 24px;\n  padding: 0 4px;\n  border-radius: 3px;\n  border: 1px solid #ccc;\n  box-shadow: inset 0 1px 1px #ccc;\n  width: 100px;\n  font-size: 12px;\n  margin-right: 5px;\n  outline: 0; }\n\n.drp-shortcuts-selectbtn {\n  line-height: 24px;\n  padding: 0 4px;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border-radius: 3px;\n  outline: 0; }\n\n.drp-shortcuts-btn {\n  display: inline-block;\n  padding: 0 5px;\n  background: #eee;\n  line-height: 24px;\n  border-radius: 3px;\n  margin-right: 4px;\n  cursor: pointer; }\n  .drp-shortcuts-btn.focus {\n    background-color: #337ab7;\n    color: #fff; }\n\n.drp-shortcuts-form {\n  margin-top: 5px; }\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var createElement = __webpack_require__(6).create;
	// 传入元素，参数，初始化之

	var today = moment();

	var Calendar = (function () {
	  function Calendar(that, callback) {
	    _classCallCheck(this, Calendar);

	    // 渲染header, 再渲染多个月份的日历
	    var el = that.el;
	    var config = that.config;
	    var numberOfCalendars = config.numberOfCalendars;
	    var lang = config.lang;
	    var maxDate = config.maxDate;
	    var minDate = config.minDate;

	    this.el = createElement('div', 'drp-calendar');
	    this.parent = el;
	    this.calNum = numberOfCalendars;
	    this.current = that.range ? moment(that.range.start) : that.date ? moment(that.date) : moment();
	    this.reload = callback;
	    this.lang = lang;
	    if (maxDate) this.maxDate = maxDate.endOf('day');
	    if (minDate) this.minDate = minDate.startOf('day');
	    this.draw();
	    el.appendChild(this.el);
	  }

	  _createClass(Calendar, [{
	    key: 'draw',
	    value: function draw(current) {
	      if (current) this.current = moment(current);
	      moment.locale(this.lang || 'zh-cn');
	      // 清空之前的数据
	      this.el.innerHTML = '';
	      this.month = [];
	      this.current = this.current.subtract(Math.ceil(this.calNum / 2), 'month');
	      this.drawPointer();
	      for (var i = 0; i < this.calNum; i++) {
	        this.current = this.current.date(1).add(1, 'month');
	        this.drawHeader(i);
	        this.drawMonth(i);
	      }
	    }
	  }, {
	    key: 'drawPointer',
	    value: function drawPointer() {
	      var _this = this;

	      var right = createElement('div', 'drp-right');
	      right.addEventListener('click', function () {
	        _this.nextMonth();
	      });

	      var left = createElement('div', 'drp-left');
	      left.addEventListener('click', function () {
	        _this.prevMonth();
	      });
	      this.parent.appendChild(right);
	      this.parent.appendChild(left);
	    }
	  }, {
	    key: 'drawHeader',
	    value: function drawHeader(i) {
	      this.header = createElement('div', 'drp-header', this.current.format('MMM YYYY'));
	      this.el.appendChild(this.header);
	      this.drawWeekDays();
	      this.header.innerHTML = this.current.format('MMM YYYY');
	    }
	  }, {
	    key: 'drawMonth',
	    value: function drawMonth(num) {
	      this.month.push(createElement('div', 'drp-month'));
	      this.backFill();
	      this.currentMonth();
	      this.fowardFill();
	      this.el.appendChild(this.month[this.month.length - 1]);
	    }
	  }, {
	    key: 'backFill',
	    value: function backFill() {
	      var clone = this.current.clone();
	      var dayOfWeek = clone.day();

	      if (!dayOfWeek) {
	        return;
	      }

	      clone.subtract(dayOfWeek + 1, 'days');

	      for (var i = dayOfWeek; i > 0; i--) {
	        this.drawDay(clone.add(1, 'days'));
	      }
	    }
	  }, {
	    key: 'fowardFill',
	    value: function fowardFill() {
	      var clone = this.current.clone().add(1, 'months').subtract(1, 'days');
	      var dayOfWeek = clone.day();

	      if (dayOfWeek === 6) {
	        return;
	      }

	      for (var i = dayOfWeek; i < 6; i++) {
	        this.drawDay(clone.add(1, 'days'));
	      }
	    }
	  }, {
	    key: 'currentMonth',
	    value: function currentMonth() {
	      var clone = this.current.clone();

	      while (clone.month() === this.current.month()) {
	        this.drawDay(clone);
	        clone.add(1, 'days');
	      }
	    }
	  }, {
	    key: 'getWeek',
	    value: function getWeek(day) {
	      if (!this.week || day.day() === 0) {
	        this.week = createElement('div', 'drp-week');
	        this.month[this.month.length - 1].appendChild(this.week);
	      }
	    }
	  }, {
	    key: 'drawDay',
	    value: function drawDay(day) {
	      this.getWeek(day);

	      //Outer Day
	      var outer = createElement('div', this.getDayClass(day));
	      var className = 'drp-day-number';
	      if (this.minDate && day.isBefore(this.minDate) || this.maxDate && day.isAfter(this.maxDate)) className = 'drp-day-static';
	      //Day Number
	      var number = createElement('div', className, day.format('DD'));
	      number.setAttribute('date', day.format('YYYY-MM-DD'));
	      outer.appendChild(number);
	      this.week.appendChild(outer);
	    }
	  }, {
	    key: 'getDayClass',
	    value: function getDayClass(day) {
	      var classes = ['drp-day'];
	      if (day.month() !== this.current.month()) {
	        classes.push('drp-other');
	      } else if (today.isSame(day, 'day')) {
	        classes.push('drp-today');
	      }
	      return classes.join(' ');
	    }
	  }, {
	    key: 'drawWeekDays',
	    value: function drawWeekDays(el) {
	      var _this2 = this;

	      this.weekDays = createElement('div', 'drp-week-days');
	      // 获取一个星期的每一天
	      var weekdays = [];
	      for (var i = 0; i < 7; i++) {
	        weekdays.push(moment().weekday(i - 1).format('ddd'));
	      }
	      weekdays.forEach(function (weekday) {
	        var day = createElement('span', 'drp-day', weekday);
	        _this2.weekDays.appendChild(day);
	      });
	      this.el.appendChild(this.weekDays);
	    }
	  }, {
	    key: 'nextMonth',
	    value: function nextMonth() {
	      this.current.subtract(Math.floor(this.calNum / 2) - 1, 'months');
	      this.next = true;
	      this.draw();
	      this.reload();
	    }
	  }, {
	    key: 'prevMonth',
	    value: function prevMonth() {
	      this.current.subtract(Math.floor(this.calNum / 2) + 1, 'months');
	      this.next = false;
	      this.draw();
	      this.reload();
	    }
	  }]);

	  return Calendar;
	})();

	module.exports = Calendar;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var getEBA = __webpack_require__(7);

	var _require = __webpack_require__(8);

	var classArr = _require.classArr;
	var classFunc = _require.classFunc;
	var format = _require.format;
	var getDate = _require.getDate;

	var containsAll = function containsAll(el, classNameArr) {
	  var pass = true;
	  classNameArr.forEach(function (className) {
	    if (!el.classList.contains(className)) pass = false;
	  });
	  return pass;
	};

	var removeAll = function removeAll(el, classNameArr) {
	  var list = el.classList;
	  if (containsAll(el, classNameArr)) {
	    var nameArr = el.className.split(' ');
	    classNameArr.forEach(function (item) {
	      var index = nameArr.indexOf(item);
	      if (index !== -1) nameArr.splice(index, 1);
	    });
	    if (list.contains('hover') && nameArr.length === 3 || !list.contains('hover') && nameArr.length === 2) {
	      list.remove('active');
	      if (!list.contains('focus')) list.remove('start', 'end');
	    } else {
	      list.remove.apply(list, _toConsumableArray(classNameArr));
	    }
	  }
	};

	module.exports = {
	  hasChild: function hasChild(parent, child) {
	    var result = false;
	    var walk = function walk(node) {
	      if (node === child) {
	        result = true;
	      }
	      if (node.childNodes && node.childNodes.length) {
	        walk(node.childNodes[0]);
	      }
	      if (node.nextSibling) {
	        walk(node.nextSibling);
	      }
	    };
	    walk(parent);
	    return result;
	  },
	  create: function create(tagName, className, innerText) {
	    var element = document.createElement(tagName);
	    if (className) {
	      element.className = className;
	    }
	    if (innerText) {
	      if (tagName !== 'input') element.innderText = element.textContent = innerText;else element.value = innerText;
	    }
	    return element;
	  },
	  choose: function choose(rangeElements, startItem, endItem, target, firstItem) {
	    var newStartEls = [];
	    var newSegmentEls = [];
	    var newEndEls = [];
	    var thatRange = moment.range(startItem, endItem);
	    thatRange.by('days', function (moment) {
	      var arr = getEBA(target, 'date', format(moment));
	      if (moment.isAfter(startItem)) {
	        if (moment.isBefore(endItem)) {
	          // 这里是过程
	          newSegmentEls.push.apply(newSegmentEls, _toConsumableArray(arr));
	        } else {
	          // 这里是结束
	          newEndEls.push.apply(newEndEls, _toConsumableArray(arr));
	        }
	      } else {
	        // 这里是start
	        newStartEls.push.apply(newStartEls, _toConsumableArray(arr));
	      }
	    });

	    // 如果起止重合
	    if (!newEndEls[0]) {
	      newStartEls.forEach(function (item) {
	        if (newEndEls.indexOf(item) === -1) newEndEls.push(item);
	      });
	    }
	    // 去除老的，增加新的，最后赋值
	    var newRangeElements = [newStartEls, newSegmentEls, newEndEls];
	    rangeElements = this.change(rangeElements, newRangeElements, firstItem);
	    return rangeElements;
	  },
	  change: function change(rangeElements, newRangeElements, firstItem) {
	    var className = null;
	    // 全部清除
	    rangeElements.forEach(function (els, i) {
	      className = classFunc(firstItem, classArr[i]).split(' ');
	      els.forEach(function (item) {
	        removeAll(item, className);
	      });
	    });
	    // 全部增加
	    newRangeElements.forEach(function (els, i) {
	      className = classFunc(firstItem, classArr[i]).split(' ');
	      els.forEach(function (item) {
	        if (!containsAll(item, className) || rangeElements[0] === rangeElements[2]) {
	          var _item$classList;

	          (_item$classList = item.classList).add.apply(_item$classList, _toConsumableArray(className));
	        }
	      });
	    });
	    return newRangeElements;
	  },
	  clear: function clear(el, range) {
	    var i = null;
	    var els = null;
	    var momentStr = null;
	    // 复制一个新的range
	    var thatRange = moment.range([moment(range.start), moment(range.end)]);
	    thatRange.start.set({ 'hour': 0, 'minute': 0, 'second': 0 });
	    thatRange.by('days', function (moment) {
	      momentStr = format(moment);
	      switch (momentStr) {
	        case format(thatRange.start):
	          i = 0;
	          break;
	        case format(thatRange.end):
	          i = 2;
	          break;
	        default:
	          i = 1;
	          break;
	      }
	      els = getEBA(el, 'date', momentStr);
	      els.forEach(function (item) {
	        item.classList.remove('focus', classArr[i]);
	      });
	    });
	  },
	  clearRange: function clearRange(rangeElements, targetElements) {
	    var className;
	    rangeElements.forEach(function (els, i) {
	      els.forEach(function (item) {
	        removeAll(item, ['active', classArr[i]]);
	      });
	    });
	    targetElements.forEach(function (item) {
	      removeAll(item, ['active']);
	    });
	  },
	  exChange: function exChange(rangeElements) {
	    rangeElements.forEach(function (els, i) {
	      els.forEach(function (item) {
	        item.classList.remove('active');
	        item.classList.add('focus', classArr[i]);
	      });
	    });
	    return rangeElements;
	  },
	  exchangeClass: function exchangeClass(targetElements, date, el, className) {
	    className = className || '';
	    targetElements.forEach(function (oldEl) {
	      if (getDate(oldEl) === date) return;
	      if (oldEl) removeAll(oldEl, className);
	    });
	    targetElements = [];
	    getEBA(el, 'date', date).forEach(function (item) {
	      item.classList.add(className);
	      targetElements.push(item);
	    });
	    return targetElements;
	  }
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	// 查找指定元素中含有某个属性的项
	var getElementsByAttribute = function getElementsByAttribute(el, attr, value) {
	  return Array.prototype.slice.call(el.querySelectorAll('[' + attr + '=\'' + value + '\']'));
	};

	module.exports = getElementsByAttribute;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  classArr: ['start', 'segment', 'end'],

	  getDate: function getDate(el) {
	    return el.getAttribute('date');
	  },
	  format: function format(date) {
	    return date.format('YYYY-MM-DD');
	  },
	  classFunc: function classFunc(firstItem, classStr) {
	    return (firstItem ? 'active ' : 'focus ') + classStr;
	  },

	  zero: '2000-01-01 00:00'
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var createElement = __webpack_require__(6).create;

	var _require = __webpack_require__(8);

	var zero = _require.zero;

	var TimePicker = (function () {
	  function TimePicker(that) {
	    _classCallCheck(this, TimePicker);

	    var el = that.el;
	    var config = that.config;
	    var selectFunc = that.selectFunc;

	    this.el = el;
	    this.config = config;
	    this.selectFunc = selectFunc;
	    this.hours = [];
	    this.minutes = [];
	    this.timeText = null;
	    this.secondTimeText = null;
	    this.input = [];
	    this.init(that);
	  }

	  _createClass(TimePicker, [{
	    key: 'init',
	    value: function init(that) {
	      var type = this.config.type;
	      var timeBox = createElement('div', 'drp-time');
	      this.timeText = createElement('div', 'drp-time-text');
	      var thatZero = moment(zero);
	      if (type === 'single') {
	        timeBox.appendChild(this.timeText);
	        timeBox.appendChild(this.createInput(true, that.date || thatZero));
	        timeBox.appendChild(this.createInput(false, that.date || thatZero));
	      } else if (type === 'range' || type === 'terminal') {
	        this.secondTimeText = createElement('div', 'drp-time-text');
	        var start = that.range ? that.range.start : thatZero;
	        var end = that.range ? that.range.end : thatZero;
	        timeBox.appendChild(this.insertItemBox(this.timeText, this.createInput(true, start, true), this.createInput(false, start, true)));
	        timeBox.appendChild(this.insertItemBox(this.secondTimeText, this.createInput(true, end, false), this.createInput(false, end, false)));
	      }
	      this.el.appendChild(timeBox);
	    }
	  }, {
	    key: 'insertItemBox',
	    value: function insertItemBox(text, rangeStart, rangeEnd) {
	      var timeItemBox = createElement('div', 'drp-time-item');
	      timeItemBox.appendChild(text);
	      timeItemBox.appendChild(rangeStart);
	      timeItemBox.appendChild(rangeEnd);
	      return timeItemBox;
	    }
	  }, {
	    key: 'createInput',
	    value: function createInput(isHour, now, isStart) {
	      var _this = this;

	      var el = createElement('input', 'drp-time-input');
	      el.type = 'range';
	      el.min = 0;
	      el.max = isHour ? 23 : 59;
	      this.input.push(el);
	      this.setParams(isHour, now, isStart);
	      el.addEventListener('input', function (e) {
	        now = isHour ? now.hours(e.target.value) : now.minutes(e.target.value);
	        _this.setParams(isHour, now, isStart);
	        _this.selectFunc(null);
	      });
	      return el;
	    }
	  }, {
	    key: 'setParams',
	    value: function setParams(isHour, now, isStart) {
	      var type = this.config.type;
	      if (type === 'single') {
	        this.timeText.innerHTML = now.format('LT');
	        if (isHour) this.input[0].value = this.hours[0] = now.format('HH');else this.input[1].value = this.minutes[0] = now.format('mm');
	      } else if (type === 'range' || type === 'terminal') {
	        if (isStart) {
	          this.timeText.innerHTML = now.format('LT');
	          if (isHour) this.input[0].value = this.hours[0] = now.format('HH');else this.input[1].value = this.minutes[0] = now.format('mm');
	        } else {
	          this.secondTimeText.innerHTML = now.format('LT');
	          if (isHour) this.input[2].value = this.hours[1] = now.format('HH');else this.input[3].value = this.minutes[1] = now.format('mm');
	        }
	      }
	    }
	  }, {
	    key: 'setTime',
	    value: function setTime(time) {
	      var type = this.config.type;
	      if (type === 'single') {
	        this.setParams(true, time);
	        this.setParams(false, time);
	      } else if (type === 'range' || type === 'terminal') {
	        this.setParams(true, time.start, true);
	        this.setParams(false, time.start, true);
	        this.setParams(true, time.end, false);
	        this.setParams(false, time.end, false);
	      }
	    }
	  }]);

	  return TimePicker;
	})();

	module.exports = TimePicker;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var createElement = __webpack_require__(6).create;
	var Lang = __webpack_require__(11);
	var format = __webpack_require__(8).format;

	// 快速选择按钮逻辑

	var Shortcuts = (function () {
	  function Shortcuts(that, config) {
	    var _this = this;

	    _classCallCheck(this, Shortcuts);

	    this.lang = Lang[that.config.lang];
	    this.el = config.el;
	    this.btns = config.btns;
	    this.dateEL = null;
	    this.rangeStartEL = null;
	    this.rangeEndEL = null;
	    this.formEL = null;
	    if (!this.btns || !this.btns.length) this.btns = ['today', 'yesterday', 'lastWeek', 'lastMonth', 'custom'];
	    // 生成各个按钮
	    this.btns.forEach(function (item) {
	      if (_this.lang[item]) _this.setBtn(that, _this.lang[item]);
	    });
	    // 生成自定义表单
	    this.formEL = createElement('form', 'drp-shortcuts-form');
	    this.formEL.style.display = 'none';
	    var selectBtnEL = createElement('button', 'drp-shortcuts-selectbtn', this.lang.select);
	    selectBtnEL.type = 'button';
	    if (this.btns.indexOf('custom') !== -1) {
	      var _that$config = that.config;
	      var minDate = _that$config.minDate;
	      var maxDate = _that$config.maxDate;
	      var type = _that$config.type;

	      if (type === 'single') {
	        this.dateEL = createElement('input', 'drp-shortcuts-input', format(that.date));
	        this.formEL.appendChild(this.dateEL);
	        this.formEL.appendChild(selectBtnEL);
	        selectBtnEL.addEventListener('click', function (e) {
	          var date = moment(_this.dateEL.value);
	          if (date.isValid()) {
	            if (date.isBefore(minDate)) date = minDate;
	            if (date.isAfter(maxDate)) date = maxDate;
	            if (!date.isSame(that.date)) {
	              that.set('date', date);
	              that.selectFunc();
	            }
	          }
	          _this.dateEL.value = format(that.date);
	        });
	      } else {
	        this.rangeStartEL = createElement('input', 'drp-shortcuts-input', format(that.range.start));
	        this.rangeEndEL = createElement('input', 'drp-shortcuts-input', format(that.range.end));
	        this.formEL.appendChild(this.rangeStartEL);
	        this.formEL.appendChild(this.rangeEndEL);
	        this.formEL.appendChild(selectBtnEL);
	        selectBtnEL.addEventListener('click', function (e) {
	          var start = moment(_this.rangeStartEL.value);
	          var end = moment(_this.rangeEndEL.value);
	          if (start.isValid() && end.isValid) {
	            if (start.isAfter(end)) start = end;
	            if (start.isBefore(minDate)) start = minDate;
	            if (end.isAfter(maxDate)) end = maxDate;
	            if (!moment.range(start, end).isSame(that.range)) {
	              that.set('range', moment.range(start, end));
	              that.selectFunc();
	            }
	          }
	          _this.rangeStartEL.value = format(that.range.start);
	          _this.rangeEndEL.value = format(that.range.end);
	        });
	      }
	    }
	    this.el.appendChild(this.formEL);
	  }

	  _createClass(Shortcuts, [{
	    key: 'setBtn',
	    value: function setBtn(that, str) {
	      var _this2 = this;

	      if (that.config.type === 'single' && (str === this.lang.lastWeek || str === this.lang.lastMonth)) return;
	      var btn = createElement('a', 'drp-shortcuts-btn', str);

	      btn.addEventListener('click', function (e) {

	        var isSingle = that.config.type === 'single';
	        var today = moment().startOf('day');
	        var yesterday = moment().startOf('day').subtract(1, 'days');
	        var pass = _this2.btns.indexOf('today') !== -1 && _this2.btns.indexOf('yesterday') === -1;
	        var lastWeek = moment.range(pass ? moment(yesterday).subtract(1, 'days') : moment(today).subtract(6, 'days'), pass ? yesterday : today);
	        var lastMonth = moment.range(pass ? moment(yesterday).subtract(1, 'months').add(1, 'days') : moment(today).subtract(1, 'months').add(1, 'days'), pass ? yesterday : today);
	        _this2.exchangeButton(e.target);
	        _this2.formEL.style.display = 'none';
	        switch (e.target.innerHTML) {
	          case _this2.lang.today:
	            if (isSingle) that.set('date', today);else that.set('range', moment.range(today, today));
	            that.selectFunc();
	            break;
	          case _this2.lang.yesterday:
	            if (isSingle) that.set('date', yesterday);else that.set('range', moment.range(yesterday, yesterday));
	            that.selectFunc();
	            break;
	          case _this2.lang.lastWeek:
	            if (!isSingle) that.set('range', lastWeek);
	            that.selectFunc();
	            break;
	          case _this2.lang.lastMonth:
	            if (!isSingle) that.set('range', lastMonth);
	            that.selectFunc();
	            break;
	          case _this2.lang.custom:
	            _this2.formEL.style.display = 'block';
	            break;
	        }
	      });
	      this.el.appendChild(btn);
	    }
	  }, {
	    key: 'setInput',
	    value: function setInput(type, date) {
	      if (type === 'single') {
	        this.dateEL.value = format(date);
	      } else {
	        this.rangeStartEL.value = format(date.start);
	        this.rangeEndEL.value = format(date.end);
	      }
	    }
	  }, {
	    key: 'exchangeButton',
	    value: function exchangeButton(target) {
	      Array.prototype.slice.call(this.el.querySelectorAll('.drp-shortcuts-btn')).forEach(function (item) {
	        item.classList.remove('focus');
	      });

	      target.classList.add('focus');
	    }
	  }]);

	  return Shortcuts;
	})();

	module.exports = Shortcuts;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	  'zh-cn': {
	    today: '今天',
	    yesterday: '昨天',
	    lastWeek: '最近一周',
	    lastMonth: '最近一月',
	    custom: '自定义',
	    day: '日',
	    week: '周',
	    month: '月',
	    select: '选择',
	    cancel: '取消'
	  },
	  'en': {
	    today: 'today',
	    yesterday: 'yesterday',
	    lastWeek: 'last week',
	    lastMonth: 'last month',
	    custom: 'custom',
	    day: 'day',
	    week: 'week',
	    month: 'month',
	    select: 'select',
	    cancel: 'cancel'
	  },
	  'ja': {
	    today: '今日',
	    yesterday: '昨日',
	    lastWeek: '一週間',
	    lastMonth: '一月間',
	    custom: 'カスタマ',
	    day: '日',
	    week: '週',
	    month: '月',
	    select: '選択',
	    cancel: 'キャンセル'
	  },
	  'guichu': {
	    today: '昨日',
	    yesterday: '上周',
	    lastWeek: '今日',
	    lastMonth: '去年',
	    custom: '你猜',
	    day: '月',
	    week: '日',
	    month: '周',
	    select: '取消',
	    cancel: '确定'
	  }
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var createElement = __webpack_require__(6).create;
	var lang = __webpack_require__(11);

	// 改变时间区段模块逻辑

	var Dimension = function Dimension(that, config) {
	  _classCallCheck(this, Dimension);
	};

	module.exports = Dimension;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (e, events, that) {
	  e.target.className.split(' ').forEach(function (item) {
	    if (typeof events[item] === 'function') {
	      events[item](e.target, that);
	    }
	  });
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var getEBA = __webpack_require__(7);
	var EL = __webpack_require__(6);
	var getter = __webpack_require__(8);

	module.exports = {
	  reload: function reload(that, isInit) {
	    var date = that.date;
	    var range = that.range;
	    var config = that.config;
	    var rangeElements = that.rangeElements;
	    var interval = that.interval;
	    var el = that.el;
	    var firstItem = that.firstItem;
	    var targetElements = that.targetElements;

	    switch (config.type) {
	      case 'single':
	        if (isInit) that.range = null;
	        if (that.date) that.targetElements = EL.exchangeClass(targetElements, getter.format(that.date), el, ['focus']);
	        break;
	      case 'range':
	        if (isInit) that.date = null;
	        if (that.range) that.rangeElements = EL.choose(that.rangeElements, getter.format(that.range.start), getter.format(that.range.end), el, firstItem);
	        break;
	      case 'terminal':
	        if (isInit) {
	          that.date = null;
	          that.interval = that.range.diff('days');
	        }
	        if (that.range) that.rangeElements = EL.choose(that.rangeElements, getter.format(that.range.start), getter.format(that.range.end), el);
	        break;
	    }
	  },

	  click: {
	    'drp-day-number': function drpDayNumber(target, that) {
	      var range = that.range;
	      var config = that.config;
	      var rangeElements = that.rangeElements;
	      var el = that.el;
	      var firstItem = that.firstItem;
	      var targetElements = that.targetElements;
	      var interval = that.interval;
	      var selectFunc = that.selectFunc;
	      var maxDate = config.maxDate;
	      var minDate = config.minDate;
	      // 直接返回这个时间的moment对象并设置class

	      var chooseItem = getter.getDate(target);
	      var chooseMoment = moment(chooseItem);

	      // terminal的兼容性处理
	      if (interval) {
	        if (maxDate) {
	          var max = moment(maxDate).subtract(interval, 'days');
	          if (chooseMoment.isAfter(max)) {
	            chooseMoment = max;
	            chooseItem = getter.format(chooseMoment);
	            firstItem = getter.format(moment(maxDate));
	          }
	        }
	        if (minDate) {
	          var min = moment(minDate);
	          if (chooseMoment.isBefore(min)) {
	            chooseMoment = min;
	            chooseItem = getter.format(chooseMoment);
	            firstItem = getter.format(moment(chooseMoment).add(interval, 'days'));
	          }
	        }
	      }
	      if (maxDate && chooseMoment.isAfter(maxDate) || minDate && chooseMoment.isBefore(minDate)) return;
	      if (config.type === 'single') {
	        that.date = chooseMoment;
	        if (selectFunc) selectFunc(that.date);
	        that.targetElements = EL.exchangeClass(targetElements, chooseItem, el, ['focus']);
	      } else if (config.type === 'range') {
	        if (!firstItem) {
	          // 清除已经focus的
	          EL.clear(el, range);
	          that.firstItem = chooseItem;
	          that.targetElements = EL.exchangeClass(targetElements, chooseItem, el, ['active']);
	          chooseItem = getEBA(el, 'date', that.firstItem);
	          that.rangeElements = [chooseItem, [], chooseItem];
	        } else {
	          that.range = moment(firstItem).isBefore(chooseItem) ? moment.range([firstItem, chooseItem]) : moment.range([chooseItem, firstItem]);
	          // 更换样式
	          EL.exChange(rangeElements);
	          if (selectFunc) selectFunc(that.range);
	          that.firstItem = null;
	        }
	      } else if (config.type === 'terminal') {
	        // 清除已经focus的
	        if (range) {
	          EL.clear(el, range);
	        }
	        that.range = moment.range([chooseItem, firstItem || chooseItem]);
	        // 更换样式
	        EL.exChange(rangeElements);
	        if (selectFunc) selectFunc(that.range);
	      }
	    }
	  },
	  hover: {
	    'drp-day-number': function drpDayNumber(target, that) {
	      var range = that.range;
	      var config = that.config;
	      var rangeElements = that.rangeElements;
	      var el = that.el;
	      var firstItem = that.firstItem;
	      var targetElements = that.targetElements;
	      var interval = that.interval;
	      var maxDate = config.maxDate;
	      var minDate = config.minDate;

	      var hoverItem = getter.getDate(target);

	      if (maxDate) {
	        var max = interval ? moment(maxDate).subtract(interval, 'days') : moment(maxDate);
	        if (moment(hoverItem).isAfter(max)) hoverItem = getter.format(max);
	      }

	      if (minDate && moment(hoverItem).isBefore(minDate)) {
	        hoverItem = getter.format(moment(minDate));
	      }

	      var chooseMoment = interval ? moment(hoverItem).add(interval, 'days') : moment(hoverItem);

	      if (!el) return;
	      getEBA(el, 'date', hoverItem).forEach(function (item) {
	        if (item !== target) {
	          item.classList.add('hover');
	          target.addEventListener('mouseout', function () {
	            item.classList.remove('hover');
	          });
	        }
	      });
	      if (config.type === 'range' && firstItem) {
	        if (moment(firstItem).isBefore(hoverItem)) {
	          that.rangeElements = EL.choose(rangeElements, firstItem, hoverItem, el, firstItem);
	        } else {
	          that.rangeElements = EL.choose(rangeElements, hoverItem, firstItem, el, firstItem);
	        }
	      }
	      if (config.type === 'terminal') {
	        that.firstItem = getter.format(chooseMoment);
	        that.rangeElements = EL.choose(rangeElements, hoverItem, that.firstItem, el, that.firstItem);
	      }
	    }
	  },
	  leave: function leave(that) {
	    var config = that.config;
	    var rangeElements = that.rangeElements;
	    var targetElements = that.targetElements;
	    var el = that.el;
	    var range = that.range;

	    if (config.type === 'range' || config.type === 'terminal') {
	      // 回到之前的状态
	      EL.clearRange(rangeElements, targetElements);
	      if (range) that.rangeElements = EL.choose(rangeElements, getter.format(range.start), getter.format(range.end), el);
	      that.targetElements = [];
	      that.firstItem = null;
	    }
	  }
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var hasChild = __webpack_require__(6).hasChild;

	var targetBox = null;
	var itemArr = [];

	document.body.addEventListener('mouseover', function (e) {
	  if (targetBox && !hasChild(targetBox, e.target)) {
	    itemArr.forEach(function (item) {
	      if (targetBox === item.el) {
	        item.callback();
	      }
	    });
	    targetBox = null;
	  }
	});

	module.exports = {
	  add: function add(el, callback) {
	    itemArr.push({
	      el: el,
	      callback: callback
	    });
	  },
	  getTarget: function getTarget() {
	    return targetBox;
	  },
	  setTarget: function setTarget(target) {
	    targetBox = target;
	  }
	};

/***/ }
/******/ ])
});
;