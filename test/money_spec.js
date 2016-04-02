const VMasker = require('../lib/vanilla-masker');
const expect = require('chai').expect;

describe("VanillaMasker.maskMoney", function() {

  it('throws error: "VanillaMasker: There is no element to bind." when element is undefined', function() {
    expect(function() {
      VMasker(undefined).maskMoney();
    }).to.throw(/VanillaMasker: There is no element to bind./);
  });

  it('throws error: "VanillaMasker: There is no element to bind." when element is null', function() {
    expect(function() {
      VMasker(null).maskMoney();
    }).to.throw(/VanillaMasker: There is no element to bind./);
  });

  it('throws error: "VanillaMasker: There is no element to bind." when element is blank', function() {
    expect(function() {
      VMasker("").maskMoney();
    }).to.throw(/VanillaMasker: There is no element to bind./);
  });

  it('does not throw error when element is empty array', function() {
    expect(function() {
      VMasker([]).maskMoney();
    }).not.to.throw();
  });

});

describe("VanillaMasker.toMoney", function() {

  it('returns the default money', function() {
    expect(VMasker.toMoney(10000000000)).to.equal('100.000.000,00');
  });

  it('returns 1.000,00 money when number is 1a0b0c000', function() {
    expect(VMasker.toMoney('1a0b0c000')).to.equal('1.000,00');
  });

  it('returns 0,00 money when number is 0', function() {
    expect(VMasker.toMoney(0)).to.equal('0,00');
  });

  it('returns 0,01 money when number is 1', function() {
    expect(VMasker.toMoney(1)).to.equal('0,01');
  });

  it('returns 0,10 default money number is 10', function() {
    expect(VMasker.toMoney(10)).to.equal('0,10');
  });

  it('returns 199,59 money when number is 199.59 with decimal', function() {
    expect(VMasker.toMoney(199.59)).to.equal('199,59');
  });

  it('returns 199,59 money when number is a string 199.59 with decimal', function() {
    expect(VMasker.toMoney('199.59')).to.equal('199,59');
  });

  it('returns 1.000,00 money when number is a string', function() {
    expect(VMasker.toMoney('100000')).to.equal('1.000,00');
  });

  it('returns 1.000 money when precision is 0', function() {
    expect(VMasker.toMoney(1000, {precision: 0})).to.equal('1.000');
  });

  it('returns R$ 10.000,00 when unit is R$', function() {
    expect(VMasker.toMoney(10000000000, {unit: 'R$'})).to.equal('R$ 100.000.000,00');
  });

  it('returns 100,000,000,00 when delimiter is ","', function() {
    expect(VMasker.toMoney(10000000000, {delimiter: ','})).to.equal('100,000,000,00');
  });

  it('returns 100.000.000.00 when separator is "."', function() {
    expect(VMasker.toMoney(10000000000, {separator: '.'})).to.equal('100.000.000.00');
  });

  it('returns 100.000.000,00 when zeroCents is true', function() {
    expect(VMasker.toMoney(100000000, {zeroCents: true})).to.equal('100.000.000,00');
  });

});
