import {cart, removeFromCart, updateCartQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {deliveryOptions} from '../data/deliveryOptions.js'

let cartSummaryHTML = '';

cart.forEach(cartItem => {
    const productId = cartItem.productId;

    let matchingProduct;
    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption;
    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }
    });
    const today = dayjs();
    const deliveryDate = today.add(
        deliveryOption.deliveryDays, 
        'days');
    const dateString = deliveryDate.format(
        'dddd, MMMM D'
    );


    cartSummaryHTML += `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
            Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingProduct.image}">

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">
                $${formatCurrency(matchingProduct.price)}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                Update
                </span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
        </div>
        </div>`
});

updateCartQuantityCheckOut();

function updateCartQuantityCheckOut() {
    document.querySelector('.js-checkout-cart-quantity').innerHTML = `Checkout (<a class="return-to-home-link"
            href="amazon.html">${updateCartQuantity()} items</a>)`;
}


document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
function deleteEventListeners() {
    document.querySelectorAll('.js-delete-link')
        .forEach((link) => {
            link.addEventListener('click', (event) => {
                const productId = link.dataset.productId;
                removeFromCart(productId);
                document.querySelector(`.js-cart-item-container-${productId}`).remove();
                updateCartQuantityCheckOut();
            });
        });
}
deleteEventListeners();

function saveEventListeners(productId) {
    const updateContainer = document.querySelector(`.js-product-quantity-${productId}`);
    const selectedQuantity = Number(updateContainer.querySelector(`.js-quantity-selector-save-${productId}`).value);
    let matchingItem;
    cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    });
    if (selectedQuantity > 0) {
        if (matchingItem) {
            matchingItem.quantity = selectedQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartQuantityCheckOut();
        }
    }
    updateContainer.innerHTML = 
        `<span>
        Quantity: <span class="quantity-label">${matchingItem.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary js-update-link" data-product-id="${productId}">
        Update
        </span>
        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${productId}">
        Delete
        </span>`;
    updateEventListeners();
    deleteEventListeners();
}

function updateEventListeners() {
    document.querySelectorAll('.js-update-link')
        .forEach((link) => {
            link.addEventListener('click', (event) => {
                const productId = link.dataset.productId;
                const updateContainer = document.querySelector(`.js-product-quantity-${productId}`);
                updateContainer.innerHTML = 
                    `<span>
                    Quantity: <input class = "js-quantity-selector-save-${productId}" style="width: 30px;">
                    <span class="save-quantity-link link-primary js-save-link" data-product-id="${productId}">Save</span>
                    </span>`;

                updateContainer.querySelector('.js-save-link').addEventListener('click', () => {saveEventListeners(productId)});
                updateContainer.querySelector(`.js-quantity-selector-save-${productId}`).addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        saveEventListeners(productId);
                    }
                })

            });
        });
}
updateEventListeners();

function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
        const today = dayjs();
        const deliveryDate = today.add(
            deliveryOption.deliveryDays, 
            'days');
        const dateString = deliveryDate.format(
            'dddd, MMMM D'
        );
        const priceString = deliveryOption.price === 0 ? 'FREE':
             `$${formatCurrency(deliveryOption.price)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
        html += `   <div class="delivery-option">
                <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} Shipping
                    </div>
                </div>
            </div>`
            
    });

    return html;
}