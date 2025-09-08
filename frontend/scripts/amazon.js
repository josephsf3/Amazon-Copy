import {cart, addToCart, updateCartQuantity} from '../data/cart.js';
import {products, loadProductsFetch} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
//Modules help us with naming conflicts and we dont have to worry about order of our files or script tags

function renderComponents(product) {
    const productInfo = `
        <div class="product-container">
            <div class="product-image-container">
                <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
                ${product.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
                <div class="product-rating-count link-primary">
                ${product.rating.count}
                </div>
            </div>

            <div class="product-price">
                ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
                <select class = "js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                </select>
            </div>
            ${product.extraInfoHTML()}
            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart-${product.id}">
                <img src="images/icons/checkmark.png">
                Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>
        `
    return productInfo;
}

loadProductsFetch().then(() => {
    let productsHTML = '';
    const url = new URL(window.location.href);
    let search = url.searchParams.get('search');
    if (search) {
        search = decodeURIComponent(search);
        document.querySelector('.js-search-bar').value = search;
        search = search.toLowerCase().split(" ");
        products.forEach(product => {
            if (search.some(word => product.name.toLowerCase().includes(word) || product.keywords.includes(word))) {
                productsHTML += renderComponents(product);
            }
    });
    }
    else {
        products.forEach(product => {
            productsHTML += renderComponents(product);
        });
    }
    let timeouts = {};
    if (productsHTML) {
        document.querySelector('.js-products-grid').innerHTML = productsHTML;
        document.querySelector('.css-no-products').style.display = "none";
    } else {
        document.querySelector('.js-products-grid').innerHTML = '';
        document.querySelector('.css-no-products').style.display = "block";
    }

    updateCartQuantityHome();

    function updateCartQuantityHome() {
        document.querySelector('.js-cart-quantity').innerHTML = updateCartQuantity();
    }

    function addedToCartDisplay(productId) {
        document.querySelector(`.js-added-to-cart-${productId}`).classList.add('css-added-to-cart-visible');

        if (timeouts[productId]) {
            clearTimeout(timeouts[productId]);
        }
        timeouts[productId] = setTimeout(() => {
            document.querySelector(`.js-added-to-cart-${productId}`).classList.remove('css-added-to-cart-visible');
        }, 2000);
    }


    document.querySelectorAll('.js-add-to-cart-button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            addToCart(productId);
            updateCartQuantityHome();
            addedToCartDisplay(productId);   
        });
    });
});

document.querySelector('.js-search-button')
    .addEventListener('click', () => {
      const query = encodeURIComponent(document.querySelector('.js-search-bar').value);
      window.location.href = `amazon.html?search=${query}`;
    });
document.querySelector('.js-search-bar')
.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
    const query = encodeURIComponent(document.querySelector('.js-search-bar').value);
    window.location.href = `amazon.html?search=${query}`;
    }
});