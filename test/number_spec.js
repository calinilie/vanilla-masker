const VMasker = require('../lib/vanilla-masker');
const expect = require('chai').expect;

describe("VanillaMasker.maskNumber", function() {

  it('throws error: "VanillaMasker: There is no element to bind." when element is undefined', function() {
    expect(function() {
      VMasker(undefined).maskNumber();
    }).to.throw(/VanillaMasker: There is no element to bind./);
  });

  it('throws error: "VanillaMasker: There is no element to bind." when element is null', function() {
    expect(function() {
      VMasker(null).maskNumber();
    }).to.throw(/VanillaMasker: There is no element to bind./);
  });

  it('throws error: "VanillaMasker: There is no element to bind." when element is blank', function() {
    expect(function() {
      VMasker("").maskNumber();
    }).to.throw(/VanillaMasker: There is no element to bind./);
  });

  it('does not throw error when element is empty array', function() {
    expect(function() {
      VMasker([]).maskNumber();
    }).not.to.throw();
  });

});

describe("VanillaMasker.toNumber", function() {

  it('returns 1000 number when input is 1000', function() {
    expect(VMasker.toNumber(1000)).to.equal('1000');
  });

  it('returns 100000 number when input is 1a0b0c000', function() {
    expect(VMasker.toNumber('1a0b0c000')).to.equal('100000');
  });

  it('returns 10 number when input is 1-0', function() {
    expect(VMasker.toNumber('1-0')).to.equal('10');
  });

  it('returns -10 number when input is -10', function() {
    expect(VMasker.toNumber('-10')).to.equal('-10');
  });

});
