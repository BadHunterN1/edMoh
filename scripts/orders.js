import { orders, saveToStorage } from "../data/orders.js";
import { convMoney } from "./utils/money.js";
import { cart, resetStorage } from "../data/cart-class.js";
import { searchBarCon } from "./amazon.js";
import { getProduct, loadProducts } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function renderOrder() {
    await loadProducts();
    resetStorage();
    let ordersHTML = '';
    
    await orders.forEach((order) => {
        
        const id = order.id;
        const totalCostCents = order.totalCostCents;
        
        const today = dayjs();
        const todayString = today.format('MMMM D');
        let cartPHTML = '';
        try{

        order.products.forEach((product) => {
            const productId = product.productId;
            const matchingproduct = getProduct(productId);
            const quantity = product.quantity;
            const estimatedDeliveryTime = product.estimatedDeliveryTime;
            const deliveryDate = dayjs(estimatedDeliveryTime);
            const dataString = deliveryDate.format('MMMM D');

            cartPHTML += `
                    <div class="product-image-container">
                    <img src="${matchingproduct.image}">
                    </div>

                    <div class="product-details">
                    <div class="product-name">
                        ${matchingproduct.name}
                    </div>
                    <div class="product-delivery-date">
                        Arriving on: ${dataString}
                    </div>
                    <div class="product-quantity">
                        Quantity: ${quantity}
                    </div>
                    <button class="buy-again-button button-primary js-buy-again-button" data-product-id= '${matchingproduct.id}' data-quantity= ${quantity}>
                        <img class="buy-again-icon" src="images/icons/buy-again.png">
                        <span class="buy-again-message">Buy it again</span>
                    </button>
                    </div>

                    <div class="product-actions">
                    <a href="tracking.html?orderId=${id}&productId=${matchingproduct.id}">
                        <button class="track-package-button button-secondary">
                        Track package
                        </button>
                    </a>
                    </div>
            `
        });

        ordersHTML += `
        <div class="order-container">

            <div class="order-header">
                <div class="order-header-left-section">
                    <div class="order-date">
                        <div class="order-header-label">Order Placed:</div>
                        <div>${todayString}</div>
                    </div>
                    <div class="order-total">
                        <div class="order-header-label">Total:</div>
                        <div>$${convMoney(totalCostCents)}</div>
                    </div>
                </div>

                <div class="order-header-right-section">
                    <div class="order-header-label">Order ID:</div>
                    <div>${id}</div>
                </div>
                <div class="order-header-right-section ">
                    <button class="button-primary js-button-primary" data-product-id='${id}'>delete</button>
                </div>
            </div>

            <div class="order-details-grid js-order-details-grid">
                ${cartPHTML}
            </div>
        </div>
        `
    }  catch (error) {
        console.error(`Invalid products in order: ${error}`);
        let orders1 = JSON.parse(localStorage.getItem('orders'));

        if (orders1 && orders1.length > 0) {
            orders1.shift();
            localStorage.setItem('orders', JSON.stringify(orders1));
        }
    }
    });
    
    document.querySelector('.js-orders-grid').innerHTML = ordersHTML
    
    document.querySelectorAll('.js-buy-again-button').forEach((button) => {
        button.addEventListener('click', () => {
            const { productId } = button.dataset;
            const quantity = parseInt(button.dataset.quantity, 10);
            cart.addToCart(productId, quantity);
            button.innerHTML = 'Added';
            setTimeout(() => {
                button.innerHTML = `
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
                `;
            }, 1000);
            cart.updateCartQuantity();
        })
    });
    
    document.querySelectorAll('.js-button-primary').forEach((button) => {
        button.addEventListener('click', () => {
        const { productId } = button.dataset;
        deleteOrder(productId); 
        saveToStorage();
        });
    });

    cart.updateCartQuantity();

    function deleteOrder(orderId) {
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            orders.splice(orderIndex, 1);
            renderOrder();
        } else {
            console.log(`Order with ID ${orderId} not found.`);
        }
    }
}
renderOrder();
searchBarCon();
