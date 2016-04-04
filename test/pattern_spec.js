const VMasker = require('../lib/vanilla-masker');
const expect = require('chai').expect;

describe("VanillaMasker.maskPattern", function() {

	it('throws error: "VanillaMasker: There is no element to bind." when element is undefined', function() {
		expect(function() {
			VMasker(undefined).maskPattern();
		}).to.throw(/VanillaMasker: There is no element to bind./);
	});

	it('throws error: "VanillaMasker: There is no element to bind." when element is null', function() {
		expect(function() {
			VMasker(null).maskPattern();
		}).to.throw(/VanillaMasker: There is no element to bind./);
	});

	it('throws error: "VanillaMasker: There is no element to bind." when element is blank', function() {
		expect(function() {
			VMasker("").maskPattern();
		}).to.throw(/VanillaMasker: There is no element to bind./);
	});

	it('does not throw error when element is empty array', function() {
		expect(function() {
			VMasker([]).maskPattern();
		}).not.to.throw();
	});

});

describe("VanillaMasker.toPattern", function() {

	it('returns "(61)" pattern when input is 61', function() {
		expect(VMasker.toPattern(61, '(99)')).to.equal('(61)');
	});

	it('returns "(61) 91234-5678" pattern when input is 61912345678', function() {
		expect(VMasker.toPattern(61912345678, '(99) 99999-9999')).to.equal('(61) 91234-5678');
	});

	it('returns "(10) 9991-1111" pattern when input is 1099911111', function() {
		expect(VMasker.toPattern(1099911111, '(99) 9999-9999')).to.equal('(10) 9991-1111');
	});

	it('returns "(10) 11" pattern when input is 1011', function() {
		expect(VMasker.toPattern('1011', '(99) 9999-9999')).to.equal('(10) 11');
	});

	it('returns "+10 11 4444-44" pattern when input is 1011444444', function() {
		expect(VMasker.toPattern('1011444444', '+99 99 9999-99')).to.equal('+10 11 4444-44');
	});

	it('returns "12/12/2000" pattern when input is 12122000', function() {
		expect(VMasker.toPattern(12122000, '99/99/9999')).to.equal('12/12/2000');
	});

	it('returns "10/11" pattern when input is 1011', function() {
		expect(VMasker.toPattern('1011', '99/99/9999')).to.equal('10/11');
	});

	it('returns "2000/12/12" pattern when input is 20001212', function() {
		expect(VMasker.toPattern('20001212', '9999/99/99')).to.equal('2000/12/12');
	});

	it('returns "999.111.111-01" pattern when input is 99911111101', function() {
		expect(VMasker.toPattern(99911111101, '999.999.999-99')).to.equal('999.111.111-01');
	});

	it('returns "101.1" pattern when input is 1011', function() {
		expect(VMasker.toPattern('1011', '999.999.999-99')).to.equal('101.1');
	});

	it('returns "ABC-1234" pattern when input is ABC1234', function() {
		expect(VMasker.toPattern('ABC1234', 'AAA-1234')).to.equal('ABC-1234');
	});

	it('returns incomplete result: "AB" when input is AB1 and pattern is AAA-99', function() {
		expect(VMasker.toPattern('AB1', 'AAA-99')).to.equal('AB');
	});

	it('returns "9B.GR.D08X0.4.G.117974" pattern when input is 9BGRD08X04G117974', function() {
		expect(VMasker.toPattern('9BGRD08X04G117974', 'SS.SS.SSSSS.S.S.SSSSSS')).to.equal('9B.GR.D08X0.4.G.117974');
	});

	it('returns "BB.G" pattern when input is 9BG', function() {
		expect(VMasker.toPattern('BBG', 'SS.SS.SSSSS.S.S.SSSSSS')).to.equal('BB.G');
	});

	it('returns "(4xx) xxx-xxxx" when input is 4 and placeholder is x', function() {
		expect(VMasker.toPattern('4', {
			pattern: "(999) 999-9999",
			placeholder: "x"
		})).to.equal('(4xx) xxx-xxxx');
	});

	it('returns "(___) ___-_____" when input is empty and placeholder is _', function() {
		expect(VMasker.toPattern('', {
			pattern: "(999) 999-9999",
			placeholder: "_"
		})).to.equal('(___) ___-____');
	});

	it('returns "(111) 111-1111" when input is 1111111111 and placeholder is _', function() {
		expect(VMasker.toPattern('1111111111', {
			pattern: "(999) 999-9999",
			placeholder: "_"
		})).to.equal('(111) 111-1111');
	});

	it('returns "(aaa) _____" when input is aaa999aaaa and placeholder is _', function() {
		expect(VMasker.toPattern('aaa999aaaa', {
			pattern: "(AAA) AAAAA",
			placeholder: "_"
		})).to.equal('(aaa) _____');
	});

	it('alfa num test', function() {
		expect(VMasker.toPattern('calinxx90', {
			pattern: "SSSSS-SSSS",
			placeholder: "x"
		})).to.equal('calin-xx90');
	});

	it('returns cal-in_il when pattern is AAA-AA_AA', function() {
		expect(VMasker.toPattern('calinil', {
			pattern: 'AAA-AA_AA'
		})).to.equal('cal-in_il');
	})

});