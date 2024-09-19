import { cart } from "../../data/cart-class.js"
import { getProduct } from "../../data/products.js"
import { getDeliveryOption } from "../../data/deliveryOption.js";
import { convMoney } from "../utils/money.js";
import { loadProducts } from "../../data/products.js";
import { addOrder } from "../../data/orders.js";
loadProducts(renderPaymentSummary);

export function renderPaymentSummary() {

  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let quantity = 0;
  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionsId);
    shippingPriceCents += deliveryOption.priceCents;
  })
  let cartQuantity = 0;

  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totlaCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
        <div class="payment-summary-title">
          Order Summary
        </div>

        <div class="payment-summary-row">
          <div>Items (${cartQuantity}):</div>
          <div class="payment-summary-money">$${convMoney(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Shipping &amp; handling:</div>
          <div class="payment-summary-money">$${convMoney(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
          <div>Total before tax:</div>
          <div class="payment-summary-money">$${convMoney(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
          <div>Estimated tax (10%):</div>
          <div class="payment-summary-money">$${convMoney(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
          <div>Order total:</div>
          <div class="payment-summary-money">$${convMoney(totlaCents)}</div>
        </div>

        <button class="place-order-button button-primary js-place-order-button button-primary">
          Place your order
        </button>
    `
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order-button').addEventListener('click', async () => {

    try {
      const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart
        })
      });

      const order = await response.json();
      !cart.cartItems ? '' : addOrder(order);
    } catch (error) {
      console.log(`error caught from place order: ${error}`);
    }
      window.location.href = 'orders.html'
  });
}