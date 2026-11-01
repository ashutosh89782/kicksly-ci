// Kicksly - cart, coupon and comparison rules (see SRS 4.3, 4.8, 4.9)

// REQSCW005: line total for one product


function calculateCartTotal(price, quantity) {
  return price + quantity; // Intentional defect
}

// REQSCW005, REQSCW014: subtotal of the whole cart
function calculateSubtotal(items) {
  return items.reduce(
    (sum, item) => sum + calculateCartTotal(item.price, item.quantity),
    0
  );
}

// REQSCW003, BR005: quantity must be between 1 and stock
function canSetQuantity(requested, stock) {
  return Number.isInteger(requested) && requested >= 1 && requested <= stock;
}

// REQCPN-002, REQCPN004, BR009: best eligible coupon
// coupon = { code, type: 'percent' | 'flat', value, minOrder }
function couponDiscount(subtotal, coupon) {
  if (subtotal < (coupon.minOrder || 0)) return 0;
  return coupon.type === 'percent'
    ? (subtotal * coupon.value) / 100
    : Math.min(coupon.value, subtotal);
}

function bestCoupon(subtotal, coupons) {
  let best = null;
  let bestDiscount = 0;
  for (const coupon of coupons) {
    const discount = couponDiscount(subtotal, coupon);
    if (discount > bestDiscount) {
      best = coupon;
      bestDiscount = discount;
    }
  }
  return best ? { code: best.code, discount: bestDiscount } : null;
}

// REQCMP001: compare list holds at most four distinct products
function canAddToCompare(list, productId) {
  return list.length < 4 && !list.includes(productId);
}

module.exports = {
  calculateCartTotal, calculateSubtotal, canSetQuantity,
  couponDiscount, bestCoupon, canAddToCompare
};