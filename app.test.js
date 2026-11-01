const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateCartTotal, calculateSubtotal, canSetQuantity,
  bestCoupon, canAddToCompare
} = require('./app');

test('TC1 REQSCW005: 2 pairs at Rs. 2499', () => {
  assert.equal(calculateCartTotal(2499, 2), 4998);
});
test('TC2 REQSCW005: 3 pairs at Rs. 1999', () => {
  assert.equal(calculateCartTotal(1999, 3), 5997);
});
test('TC3 REQSCW005: subtotal of two items', () => {
  const cart = [
    { price: 2499, quantity: 2 },
    { price: 1999, quantity: 1 }
  ];
  assert.equal(calculateSubtotal(cart), 6997);
});
test('TC4 REQSCW005: empty cart has subtotal 0', () => {
  assert.equal(calculateSubtotal([]), 0);
});
test('TC5 BR005: quantity within stock is allowed', () => {
  assert.equal(canSetQuantity(3, 5), true);
});
test('TC6 BR005: quantity above stock is rejected', () => {
  assert.equal(canSetQuantity(6, 5), false);
});
test('TC7 REQSCW003: quantity 0 is rejected', () => {
  assert.equal(canSetQuantity(0, 5), false);
});
test('TC8 REQCPN-002: maximum-discount coupon is chosen', () => {
  const coupons = [
    { code: 'KICK10', type: 'percent', value: 10, minOrder: 0 },
    { code: 'FLAT500', type: 'flat', value: 500, minOrder: 0 }
  ];
  const result = bestCoupon(6997, coupons);
  assert.equal(result.code, 'KICK10');
  assert.equal(result.discount, 699.7);
});
test('TC9 BR009: coupon below minimum order is ignored', () => {
  const coupons = [
    { code: 'BIG', type: 'flat', value: 1000, minOrder: 10000 }
  ];
  assert.equal(bestCoupon(6997, coupons), null);
});
test('TC10 REQCMP001: fifth product cannot be compared', () => {
  assert.equal(canAddToCompare(['a', 'b', 'c', 'd'], 'e'), false);
});