const isMobile = require('ismobilejs')
var DIGIT = "9",
	ALPHA = "A",
	ALPHANUM = "S",
	IGNORED_KEY_CODES = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93],
	isKeyboardEventAllowed = function(keyboardEvent) {
		if (keyboardEvent.ctrlKey)
			return false;

		return !IGNORED_KEY_CODES.includes(keyboardEvent.keyCode);
	},
	// Fill wildcards past index in output with placeholder
	addPlaceholdersToOutput = function(output, index, placeholder) {
		for (; index < output.length; index++) {
			if (output[index] === DIGIT || output[index] === ALPHA || output[index] === ALPHANUM) {
				output[index] = placeholder;
			}
		}
		return output;
	};

var VanillaMasker = function(elements) {
	this.elements = elements;
};

VanillaMasker.prototype.unbindElementToMask = function() {
	for (var i = 0, len = this.elements.length; i < len; i++) {
		this.elements[i].onkeyup = false;
		this.elements[i].onkeydown = false;

		if (this.elements[i].value.length) {
			this.elements[i].value = this.elements[i].value.replace(/\D/g, '');
		}
	}
};

VanillaMasker.prototype.bindElementToMask = function(maskFunction) {
	for (var i = 0, len = this.elements.length; i < len; i++) {
		this.elements[i].onkeypress = onType(maskFunction).bind(this)
		if (this.elements[i].value.length) {
			this.elements[i].value = VMasker[maskFunction](this.elements[i].value, this.opts);
		}
	}
};

function onType(maskFunction) {
	return function(event) {
		event = event || window.event;
		var inputElement = event.target || event.srcElement;

		var inputValue = inputElement.value ? inputElement.value + '' : '';
		inputValue = clearSelection(inputElement, inputValue);

		inputElement.value = VMasker[maskFunction](inputValue + String.fromCharCode(event.keyCode), this.opts);
		event.preventDefault();
	}
}

function clearSelection(element, inputValue) {
	var selectionRange = getSelectionRange(element);
	if (selectionRange.begin === selectionRange.end) {
		return inputValue;
	}

	return inputValue.replace(inputValue.substring(selectionRange.begin, selectionRange.end), '');
}

function getSelectionRange(element) {
	let begin;
	let end;
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

VanillaMasker.prototype.maskPattern = function(pattern) {
	this.opts = {
		pattern: pattern
	};
	this.bindElementToMask("toPattern");
};

VanillaMasker.prototype.unMask = function() {
	this.unbindElementToMask();
};

var VMasker = function(el) {
	if (!el) {
		throw new Error("VanillaMasker: There is no element to bind.");
	}
	var elements = ("length" in el) ? (el.length ? el : []) : [el];
	return new VanillaMasker(elements);
};


VMasker.toPattern = function(value, opts) {
	var pattern = (typeof opts === 'object' ? opts.pattern : opts),
		patternChars = pattern.replace(/\W/g, ''),
		output = pattern.split(""),
		values = value.toString().replace(/\W/g, ""),
		charsValues = values.replace(/\W/g, ''),
		index = 0,
		i,
		outputLength = output.length,
		placeholder = (typeof opts === 'object' ? opts.placeholder : undefined);

	for (i = 0; i < outputLength; i++) {
		// Reached the end of input
		if (index >= values.length) {
			if (patternChars.length == charsValues.length) {
				return output.join("");
			} else if ((placeholder !== undefined) && (patternChars.length > charsValues.length)) {
				return addPlaceholdersToOutput(output, i, placeholder).join("");
			} else {
				break;
			}
		}
		// Remaining chars in input
		else {
			if ((output[i] === DIGIT && values[index].match(/[0-9]/)) ||
				(output[i] === ALPHA && values[index].match(/[a-zA-Z]/)) ||
				(output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/))) {
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