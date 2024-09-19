export class Cart {
    cartItems;
    #localStorageName;

    constructor(localStorageName) {
        this.#localStorageName = localStorageName;
        this.#loadFromStorage();
    }

    #loadFromStorage() {
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageName));

        if (!this.cartItems) {
            this.cartItems = [];
        }
    }

    savetostorage() {
        localStorage.setItem(this.#localStorageName, JSON.stringify(this.cartItems));
    }

    addToCart(productId, quantity) {
        quantity = quantity;
        
        let deliveryOptionId;
        let matchingItem;

        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            };
        });

        if (matchingItem) {
            matchingItem.quantity += quantity;
        } else {
            this.cartItems.push({
                productId,
                quantity,
                deliveryOptionId,
            });
        }
        this.savetostorage();
    }

    updateCartQuantity() {
        let cartQuantityc;
        cartQuantityc = 0;
        cart.cartItems.forEach((cartItem) => {
            cartQuantityc += cartItem.quantity;
        })
        document.querySelector('.cart-quantity').innerHTML = `${cartQuantityc}`;
    };

    updateCartQuantityCH() {
        let cartQuantity = 0;
        this.cartItems.forEach((cartItem) => {
            cartQuantity += cartItem.quantity;
        })
        document.querySelector('.js-return-to-home-link').textContent = `${cartQuantity} items`;
    }

    removeCart(productId) {
        const newCart = [];
        this.cartItems.forEach((item) => {
            if (item.productId !== productId) {
                newCart.push(item);
            }
        })
        this.cartItems = newCart;
        this.updateCartQuantityCH();
        this.savetostorage();
    }

    updateDeliveryOption(productId, deliveryOptionId) {
        let matchingItem;
        this.cartItems.forEach((cartItem) => {
            if (productId === cartItem.productId) {
                matchingItem = cartItem;
            };
        });

        matchingItem.deliveryOptionsId = deliveryOptionId;

        this.savetostorage();
    }

    loadCart(fun) {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            console.log(xhr.response);
            fun();
        });

        xhr.open('GET', 'https://supersimplebackend.dev/cart');
        xhr.send();
    }

    async loadCartFetch() {
        const response = await fetch('https://supersimplebackend.dev/cart');
        const text = await response.text();
        console.log(text);
        return text;
    }

}

export const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

console.log(cart);
console.log(businessCart);
