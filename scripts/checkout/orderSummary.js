import { cart } from '../../data/cart-class.js';
import { products, getProduct, loadProducts } from '../../data/products.js';
import { convMoney } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOption.js';
import { renderPaymentSummary } from './paymentSummary.js';

loadProducts(renderOrderSummray);

export function renderOrderSummray() {

  let cartSummHTML = '';

  cart.updateCartQuantityCH();
  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingproduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionsId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dataString = deliveryDate.format('dddd, MMMM D');

    cartSummHTML += `<div class="order-summary">
          <div class="cart-item-container js-cart-item-container-${matchingproduct.id}">
            <div class="delivery-date">
              Delivery date: ${dataString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image" src=${matchingproduct.image}>

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingproduct.name}
                </div>
                <div class="product-price">
                  ${matchingproduct.getPrice()}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingproduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span data-product-id= '${matchingproduct.id}' class="update-quantity-link js-update-quantity-link link-primary">
                  Update
                  </span>
                  <div class="update-container">
                    <div class="product-quantity-container">
                      <div class="quantity-container">
                        <button class="quantity-btn" onclick="this.nextElementSibling.stepDown()">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="100">
                        <button class="quantity-btn" onclick="this.previousElementSibling.stepUp()">+</button>
                      </div>
                      <span data-product-id= '${matchingproduct.id}' class="save-quantity-link link-primary">Save</span>
                    </div>
                  </div>
                  <span data-product-id= '${matchingproduct.id}' class="delete-quantity-link js-delete-quantity-link link-primary">
                    Delete
                  </span>
                </div>
              </div>
              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingproduct, cartItem)}
              </div>
            </div>
          </div>`;
  });
  document.querySelector('.js-order-summary').innerHTML = cartSummHTML;

  function deliveryOptionsHTML(matchingproduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOptions) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOptions.deliveryDays, 'days');
      const dataString = deliveryDate.format('dddd, MMMM D');
      const priceString = deliveryOptions.priceCents === 0 ? 'FREE' : `${convMoney(deliveryOptions.priceCents)} -`;
      const isChecked = deliveryOptions.id === cartItem.deliveryOptionsId;
      html += `
          <div class="delivery-option js-delivery-option" data-delivery-option-id='${deliveryOptions.id}' data-product-id='${matchingproduct.id}'>
          <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${matchingproduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dataString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>`
    });
    return html;
  }

  document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      cart.removeCart(productId)

      renderOrderSummray();
      renderPaymentSummary();

    })
  })

  document.querySelectorAll('.js-update-quantity-link').forEach((link1) => {
    link1.addEventListener('click', () => {
      const productId = link1.dataset.productId;
      cart.cartItems.forEach((item) => {
        if (item.productId === productId) {
          link1.parentElement.querySelector('.update-container').classList.toggle('view');
        }
      })
    })
  });

  document.querySelectorAll('.save-quantity-link').forEach((link2) => {
    const quantityInput = link2.parentElement.querySelector('.quantity-input');
    const updateQuantity = () => {
      const productId = link2.dataset.productId;
      let quantity = Number(quantityInput.value);

      if (quantity > 100) {
        quantity = 100;
        quantityInput.value = 100;
      } else if (quantity < 1) {
        quantity = 1;
        quantityInput.value = 1;
      }

      let matchingItem;

      cart.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });

      if (matchingItem) {
        matchingItem.quantity = quantity;
        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`
        );
        quantityLabel.innerHTML = quantity;
        cart.updateCartQuantityCH();
        cart.savetostorage();
        link2.closest('.update-container').classList.remove('view');
      }
      renderPaymentSummary();
    };

    link2.addEventListener('click', updateQuantity);
    quantityInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        updateQuantity();
      }
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummray();
      renderPaymentSummary();
    })
  })
}
