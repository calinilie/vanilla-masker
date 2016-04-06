/******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	var isMobile = __webpack_require__(1);
	var DIGIT = "9",
	    ALPHA = "A",
	    ALPHANUM = "S",
	    IGNORED_KEY_CODES = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93],
	    isKeyboardEventAllowed = function isKeyboardEventAllowed(keyboardEvent) {
		if (keyboardEvent.ctrlKey) return false;

		return !IGNORED_KEY_CODES.includes(keyboardEvent.keyCode);
	},

	// Fill wildcards past index in output with placeholder
	addPlaceholdersToOutput = function addPlaceholdersToOutput(output, index, placeholder) {
		for (; index < output.length; index++) {
			if (output[index] === DIGIT || output[index] === ALPHA || output[index] === ALPHANUM) {
				output[index] = placeholder;
			}
		}
		return output;
	};

	var VanillaMasker = function VanillaMasker(elements) {
		this.elements = elements;
	};

	VanillaMasker.prototype.unbindElementToMask = function () {
		for (var i = 0, len = this.elements.length; i < len; i++) {
			this.elements[i].onkeyup = false;
			this.elements[i].onkeydown = false;

			if (this.elements[i].value.length) {
				this.elements[i].value = this.elements[i].value.replace(/\D/g, '');
			}
		}
	};

	VanillaMasker.prototype.bindElementToMask = function (maskFunction) {
		for (var i = 0, len = this.elements.length; i < len; i++) {
			this.elements[i].onkeypress = onType(maskFunction).bind(this);
			if (this.elements[i].value.length) {
				this.elements[i].value = VMasker[maskFunction](this.elements[i].value, this.opts);
			}
		}
	};

	function onType(maskFunction) {
		return function (event) {
			event = event || window.event;
			var inputElement = event.target || event.srcElement;

			var inputValue = inputElement.value ? inputElement.value + '' : '';
			inputValue = clearSelection(inputElement, inputValue);

			inputElement.value = VMasker[maskFunction](inputValue + String.fromCharCode(event.keyCode), this.opts);
			event.preventDefault();
		};
	}

	function clearSelection(element, inputValue) {
		var selectionRange = getSelectionRange(element);
		if (selectionRange.begin === selectionRange.end) {
			return inputValue;
		}

		return inputValue.replace(inputValue.substring(selectionRange.begin, selectionRange.end), '');
	}

	function getSelectionRange(element) {
		var begin = void 0;
		var end = void 0;
		if (element.setSelectionRange) {
			begin = element.selectionStart;
			end = element.selectionEnd;
		} else if (document.selection && document.selection.createRange) {
			range = document.selection.createRange();
			begin = 0 - range.duplicate().moveStart('character', -100000);
			end = begin + range.text.length;
		}
		return {
			begin: begin,
			end: end
		};
	}

	VanillaMasker.prototype.maskPattern = function (pattern) {
		this.opts = {
			pattern: pattern
		};
		this.bindElementToMask("toPattern");
	};

	VanillaMasker.prototype.unMask = function () {
		this.unbindElementToMask();
	};

	var VMasker = function VMasker(el) {
		if (!el) {
			throw new Error("VanillaMasker: There is no element to bind.");
		}
		var elements = "length" in el ? el.length ? el : [] : [el];
		return new VanillaMasker(elements);
	};

	VMasker.toPattern = function (value, opts) {
		var pattern = (typeof opts === "undefined" ? "undefined" : _typeof(opts)) === 'object' ? opts.pattern : opts,
		    patternChars = pattern.replace(/\W/g, ''),
		    output = pattern.split(""),
		    values = value.toString().replace(/\W/g, ""),
		    charsValues = values.replace(/\W/g, ''),
		    index = 0,
		    i,
		    outputLength = output.length,
		    placeholder = (typeof opts === "undefined" ? "undefined" : _typeof(opts)) === 'object' ? opts.placeholder : undefined;

		for (i = 0; i < outputLength; i++) {
			// Reached the end of input
			if (index >= values.length) {
				if (patternChars.length == charsValues.length) {
					return output.join("");
				} else if (placeholder !== undefined && patternChars.length > charsValues.length) {
					return addPlaceholdersToOutput(output, i, placeholder).join("");
				} else {
					break;
				}
			}
			// Remaining chars in input
			else {
					if (output[i] === DIGIT && values[index].match(/[0-9]/) || output[i] === ALPHA && values[index].match(/[a-zA-Z]/) || output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/)) {
						output[i] = values[index++];
					} else if (output[i] === DIGIT || output[i] === ALPHA || output[i] === ALPHANUM) {
						if (placeholder !== undefined) {
							return addPlaceholdersToOutput(output, i, placeholder).join("");
						} else {
							return output.slice(0, i).join("");
						}
					}
				}
		}
		return output.join("").substr(0, i);
	};

	window.VMasker = VMasker;
	module.exports = VMasker;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';

	/**
	 * isMobile.js v0.4.0
	 *
	 * A simple library to detect Apple phones and tablets,
	 * Android phones and tablets, other mobile devices (like blackberry, mini-opera and windows phone),
	 * and any kind of seven inch device, via user agent sniffing.
	 *
	 * @author: Kai Mallea (kmallea@gmail.com)
	 *
	 * @license: http://creativecommons.org/publicdomain/zero/1.0/
	 */
	(function (global) {

	    var apple_phone = /iPhone/i,
	        apple_ipod = /iPod/i,
	        apple_tablet = /iPad/i,
	        android_phone = /(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,
	        // Match 'Android' AND 'Mobile'
	    android_tablet = /Android/i,
	        amazon_phone = /(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,
	        amazon_tablet = /(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,
	        windows_phone = /IEMobile/i,
	        windows_tablet = /(?=.*\bWindows\b)(?=.*\bARM\b)/i,
	        // Match 'Windows' AND 'ARM'
	    other_blackberry = /BlackBerry/i,
	        other_blackberry_10 = /BB10/i,
	        other_opera = /Opera Mini/i,
	        other_chrome = /(CriOS|Chrome)(?=.*\bMobile\b)/i,
	        other_firefox = /(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,
	        // Match 'Firefox' AND 'Mobile'
	    seven_inch = new RegExp('(?:' + // Non-capturing group

	    'Nexus 7' + // Nexus 7

	    '|' + // OR

	    'BNTV250' + // B&N Nook Tablet 7 inch

	    '|' + // OR

	    'Kindle Fire' + // Kindle Fire

	    '|' + // OR

	    'Silk' + // Kindle Fire, Silk Accelerated

	    '|' + // OR

	    'GT-P1000' + // Galaxy Tab 7 inch

	    ')', // End non-capturing group

	    'i'); // Case-insensitive matching

	    var match = function match(regex, userAgent) {
	        return regex.test(userAgent);
	    };

	    var IsMobileClass = function IsMobileClass(userAgent) {
	        var ua = userAgent || navigator.userAgent;

	        // Facebook mobile app's integrated browser adds a bunch of strings that
	        // match everything. Strip it out if it exists.
	        var tmp = ua.split('[FBAN');
	        if (typeof tmp[1] !== 'undefined') {
	            ua = tmp[0];
	        }

	        // Twitter mobile app's integrated browser on iPad adds a "Twitter for
	        // iPhone" string. Same probable happens on other tablet platforms.
	        // This will confuse detection so strip it out if it exists.
	        tmp = ua.split('Twitter');
	        if (typeof tmp[1] !== 'undefined') {
	            ua = tmp[0];
	        }

	        this.apple = {
	            phone: match(apple_phone, ua),
	            ipod: match(apple_ipod, ua),
	            tablet: !match(apple_phone, ua) && match(apple_tablet, ua),
	            device: match(apple_phone, ua) || match(apple_ipod, ua) || match(apple_tablet, ua)
	        };
	        this.amazon = {
	            phone: match(amazon_phone, ua),
	            tablet: !match(amazon_phone, ua) && match(amazon_tablet, ua),
	            device: match(amazon_phone, ua) || match(amazon_tablet, ua)
	        };
	        this.android = {
	            phone: match(amazon_phone, ua) || match(android_phone, ua),
	            tablet: !match(amazon_phone, ua) && !match(android_phone, ua) && (match(amazon_tablet, ua) || match(android_tablet, ua)),
	            device: match(amazon_phone, ua) || match(amazon_tablet, ua) || match(android_phone, ua) || match(android_tablet, ua)
	        };
	        this.windows = {
	            phone: match(windows_phone, ua),
	            tablet: match(windows_tablet, ua),
	            device: match(windows_phone, ua) || match(windows_tablet, ua)
	        };
	        this.other = {
	            blackberry: match(other_blackberry, ua),
	            blackberry10: match(other_blackberry_10, ua),
	            opera: match(other_opera, ua),
	            firefox: match(other_firefox, ua),
	            chrome: match(other_chrome, ua),
	            device: match(other_blackberry, ua) || match(other_blackberry_10, ua) || match(other_opera, ua) || match(other_firefox, ua) || match(other_chrome, ua)
	        };
	        this.seven_inch = match(seven_inch, ua);
	        this.any = this.apple.device || this.android.device || this.windows.device || this.other.device || this.seven_inch;

	        // excludes 'other' devices and ipods, targeting touchscreen phones
	        this.phone = this.apple.phone || this.android.phone || this.windows.phone;

	        // excludes 7 inch devices, classifying as phone or tablet is left to the user
	        this.tablet = this.apple.tablet || this.android.tablet || this.windows.tablet;

	        if (typeof window === 'undefined') {
	            return this;
	        }
	    };

	    var instantiate = function instantiate() {
	        var IM = new IsMobileClass();
	        IM.Class = IsMobileClass;
	        return IM;
	    };

	    if (typeof module !== 'undefined' && module.exports && typeof window === 'undefined') {
	        //node
	        module.exports = IsMobileClass;
	    } else if (typeof module !== 'undefined' && module.exports && typeof window !== 'undefined') {
	        //browserify
	        module.exports = instantiate();
	    } else if (true) {
	        //AMD
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (global.isMobile = instantiate()), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        global.isMobile = instantiate();
	    }
	})(undefined);

/***/ }
/******/ ]);