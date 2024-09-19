import { orders } from "../data/orders.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getProduct, loadProducts } from "../data/products.js";
import { searchBarCon } from "./amazon.js";
import { cart } from "../data/cart-class.js";

async function renderTracking() {
    await loadProducts();

    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');

    let matchingorder;
    let matchingorderproduct;
    const matchingproduct = getProduct(productId);


    orders.forEach(order => {
        if (order.id === orderId) {
            matchingorder = order
        };
        order.products.forEach(product => {
            if (product.productId === productId) {
                matchingorderproduct = product
            }
        });
    });

    const estimatedDeliveryTime = matchingorderproduct.estimatedDeliveryTime;

    const today = dayjs();
    const orderTime = dayjs(matchingorder.orderTime);
    const deliveryDate = dayjs(estimatedDeliveryTime);
    const percentProgress = ((today - orderTime) / (deliveryDate - orderTime)) * 100;
    const dataString = deliveryDate.format('dddd, MMMM D');

    let trackHTML;
    trackHTML = `
            <div class="order-tracking">
            <a class="back-to-orders-link link-primary" href="orders.html">
                View all orders
            </a>

            <div class="delivery-date">
                Arriving on ${dataString}
            </div>

            <div class="product-info">
                ${matchingproduct.name}
            </div>

            <div class="product-info">
                Quantity: ${matchingorderproduct.quantity}
            </div>

            <img class="product-image" src="${matchingproduct.image}">

            <div class="progress-labels-container">
                <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''}">
                    Preparing
                </div>
                <div class="progress-label ${(percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''}"> 
                    Shipped
                </div>
                <div class="progress-label ${percentProgress >= 100 ? "current-status" : ''}"> 
                    Delivered
                </div>
            </div>

            <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${percentProgress}%;"></div>
            </div>
            </div>
    `

    document.querySelector('.main').innerHTML = trackHTML;

    cart.updateCartQuantity();
}

renderTracking();
searchBarCon();