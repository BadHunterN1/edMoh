import { cart } from '../data/cart-class.js';
import { products, loadProducts } from '../data/products.js';

loadProducts().then(() => {
  renderProductsGrid();
});

function renderProductsGrid() {

  let productHTML = '';
  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  if (search) {
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword ||
        product.name.toLowerCase().includes(search.toLowerCase());
    });
  }

  filteredProducts.forEach((product) => {
    productHTML += `<div class="product-container">
          <div class="product-image-container">
            <img class="product-image" src=${product.image}>
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars" src="${product.getStarUrl()}">
            <div class="product-rating-count link-primary">
              ${product.rating.count}
            </div>
          </div>

          <div class="product-price">
            ${product.getPrice()}
          </div>

          <div class="product-quantity-container">
            <div class="quantity-container">
              <button class="quantity-btn" onclick="this.nextElementSibling.stepDown()">-</button>
              <input type="number" class="quantity-input" value="1" min="1" max="100">
              <button class="quantity-btn" onclick="this.previousElementSibling.stepUp()">+</button>
            </div>
          </div>

          ${product.extraInfoHTML()}

          <div class="product-spacer"></div>

          <div class="added-to-cart">
          </div>

          <button class="add-to-cart-button button-primary js-added-to-cart"
          data-product-id = "${product.id}">
            Add to Cart
          </button>
        </div>`
  })

  const productsGrid = document.querySelector('.js-products-grid');
  productsGrid.innerHTML = productHTML;

  let timeId;

  cart.updateCartQuantity();
  document.querySelectorAll('.js-added-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const { productId } = button.dataset;
      const quantityInput = button.parentElement.querySelector('.quantity-input');
      let quantity = Number(quantityInput.value);
      if (quantity > 100) {
          quantity = 100;
          quantityInput.value = 100;
      } else if (quantity < 1) {
          quantity = 1;
          quantityInput.value = 1;
      }
      cart.addToCart(productId, quantity);

      cart.updateCartQuantity();

      button.parentElement.querySelectorAll('.added-to-cart').forEach((addedT) => {

        addedT.innerHTML = `<img src="images/icons/checkmark.png"> Added`;
        addedT.classList.add('show');

        timeId = setTimeout(() => {

          addedT.innerHTML = ``;
          addedT.classList.remove('show');
        }, 2000)
        
      });
    });
  });
};

export function searchBarCon() {
  
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-bar');
  function search() {
    let getText = searchInput.value
    window.location.href = `index.html?search=${getText}`
    products.includes(`${getText}`)
  }
  

  searchButton.addEventListener('click', search);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      search();
    }
  });

}
searchBarCon();
