import { convMoney } from "../scripts/utils/money.js";
export function getProduct(productId) {
  let matchingproduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingproduct = product;
    }
  })
  return matchingproduct
};

function removeItemsById(array, idsToRemove) {
  return array.filter(item => !idsToRemove.includes(item.id));
};

class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keywords;

  constructor(productDetails) {
    this.id = productDetails.id
    this.image = productDetails.image
    this.name = productDetails.name
    this.rating = productDetails.rating
    this.priceCents = productDetails.priceCents
    this.keywords = productDetails.keywords;
  }

  getStarUrl() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }

  getPrice() {
    return `$${convMoney(this.priceCents)}`
  }

  extraInfoHTML() {
    return '';
  }
}

class Clothing extends Product {
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails)
    this.sizeChartLink = productDetails.sizeChartLink
  }

  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target = "_blank" >Size Chart</a>
    `;
  }
}

class Appliances extends Product {
  warrantyLink;

  constructor(productDetails) {
    super(productDetails)
    this.warrantyLink = productDetails.warrantyLink
  }

  extraInfoHTML() {
    return `
      <a href="${this.warrantyLink}" target = "_blank" >Warranty</a>
    `;
  }
}

export let products = [];

export function loadProducts() {
  const promise = fetch('https://supersimplebackend.dev/products')
    .then((response) => response.json())
    .then((fetchProducts) => {

      const idsToRemove = [
        "5968897c-4d27-4872-89f6-5bcb052746d7",
        "a45cfa0a-66d6-4dc7-9475-e2b01595f7d7",
        "b0f17cc5-8b40-4ca5-9142-b61fe3d98c85"
      ];

      const updatedArray = removeItemsById(fetchProducts, idsToRemove);

      const newItems = [{
        id: "1",
        image: "images/products/71LmcE5KJ+L.jpg",
        name: "MSI GAMING X RTX 4070 SUPER 12GB",
        rating: {
          stars: 4.5,
          count: 9475
        },
        priceCents: 70000,
        type: 'appliances',
        warrantyLink: "images/appliance-warranty.png",
        keywords: ['gpu', 'nvidia', 'Graphics Card', 'MSI GAMING X RTX 4070 SUPER 12GB']
      }];

      const finalArray = [...updatedArray, ...newItems];

      products = finalArray.map((productDetails) => {
        if (productDetails.type === 'clothing') {
          return new Clothing(productDetails);
        } else if (productDetails.type === 'appliances') {
          return new Appliances(productDetails);
        }
        return new Product(productDetails);
      });
    })
    .catch((error) => {
      console.log(`Error caught: ${error}`);
    });

  return promise;
}
