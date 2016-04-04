(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.VMasker = factory();
	}
}(this, function() {
	var DIGIT = "9",
		ALPHA = "A",
		ALPHANUM = "S",
		IGNORED_KEY_CODES = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93],
		isKeyboardEventAllowed = function(keyboardEvent) {
			if (keyboardEvent.ctrlKey)
				return false;

			return !IGNORED_KEY_CODES.includes(keyboardEvent.keyCode);
		},
		mergeMoneyOptions = function(opts) {
			opts = opts || {};
			opts = {
				precision: opts.hasOwnProperty("precision") ? opts.precision : 2,
				separator: opts.separator || ",",
				delimiter: opts.delimiter || ".",
				unit: opts.unit && (opts.unit.replace(/[\s]/g, '') + " ") || "",
				suffixUnit: opts.suffixUnit && (" " + opts.suffixUnit.replace(/[\s]/g, '')) || "",
				zeroCents: opts.zeroCents,
				lastOutput: opts.lastOutput
			};
			opts.moneyPrecision = opts.zeroCents ? 0 : opts.precision;
			return opts;
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
			this.elements[i].lastOutput = "";
			this.elements[i].onkeyup = false;
			this.elements[i].onkeydown = false;

			if (this.elements[i].value.length) {
				this.elements[i].value = this.elements[i].value.replace(/\D/g, '');
			}
		}
	};

	VanillaMasker.prototype.bindElementToMask = function(maskFunction) {
		var that = this,
			onType = function(e) {
				e = e || window.event;
				var source = e.target || e.srcElement;

				if (isKeyboardEventAllowed(e)) {
					setTimeout(function() {
						that.opts.lastOutput = source.lastOutput;
						source.value = VMasker[maskFunction](source.value, that.opts);
						source.lastOutput = source.value;
						if (source.setSelectionRange && that.opts.suffixUnit) {
							source.setSelectionRange(source.value.length, (source.value.length - that.opts.suffixUnit.length));
						}
					}, 0);
				}
			};
		for (var i = 0, len = this.elements.length; i < len; i++) {
			this.elements[i].lastOutput = "";
			this.elements[i].onkeyup = onType;
			if (this.elements[i].value.length) {
				this.elements[i].value = VMasker[maskFunction](this.elements[i].value, this.opts);
			}
		}
	};


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

	return VMasker;
}));