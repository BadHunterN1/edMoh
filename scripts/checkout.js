import { renderOrderSummray } from './checkout/orderSummary.js'
import { renderPaymentSummary } from './checkout/paymentSummary.js'
import { cart } from '../data/cart-class.js';
import { loadProducts } from '../data/products.js';

async function loadPage() {

    try {
        await Promise.all([
          loadProducts(),
          cart.loadCartFetch(),
        ])
    } catch (error) {
        console.log(`error caught ${error}`);
    };

    renderOrderSummray();
    renderPaymentSummary();
}
loadPage();
