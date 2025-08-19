import {cart, removeFromCart, saveToStorage, updateCartQuantity, updateDeliveryOption} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {deliveryOptions, getDeliveryOption, getDeliveryDate} from '../../data/deliveryOptions.js'
import {renderPaymentSummary} from "./paymentSummary.js";
import { renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderSummary(){
        
    let cartSummaryHTML = '';

    cart.forEach(cartItem => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;
        const deliveryOption = getDeliveryOption(deliveryOptionId);
        const dateString = getDeliveryDate(deliveryOption);

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
                    ${matchingProduct.getPrice()}
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

    if (cartSummaryHTML) {
        document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
        document.querySelector('.js-empty-cart').style.display = 'none';
    } else {
        document.querySelector('.js-order-summary').innerHTML = '';
        document.querySelector('.js-empty-cart').style.display = 'block';
    }


    function deleteEventListeners() {
        document.querySelectorAll('.js-delete-link')
            .forEach((link) => {
                link.addEventListener('click', (event) => {
                    const productId = link.dataset.productId;
                    removeFromCart(productId);
                    updateCartQuantity();
                    renderOrderSummary();
                    renderPaymentSummary();
                    renderCheckoutHeader();
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
                saveToStorage();
                updateCartQuantity();
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
        renderPaymentSummary();
        renderCheckoutHeader();
    }

    function updateEventListeners() {
        document.querySelectorAll('.js-update-link')
            .forEach((link) => {
                link.addEventListener('click', (event) => {
                    const productId = link.dataset.productId;
                    const updateContainer = document.querySelector(`.js-product-quantity-${productId}`);
                    updateContainer.innerHTML = 
                        `<span>
                        Quantity: <input class = "js-quantity-selector-save-${productId} css-qty-selector-save">
                        <span class="save-quantity-link link-primary js-save-link" data-product-id="${productId}">Save</span>
                        </span>`;

                    updateContainer.querySelector(`.js-quantity-selector-save-${productId}`).focus()
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
            const dateString = getDeliveryDate(deliveryOption);
            const priceString = deliveryOption.price === 0 ? 'FREE':
                `$${formatCurrency(deliveryOption.price)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
            html += `   <div class="delivery-option js-delivery-option"
                            data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
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

    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const {productId, deliveryOptionId} = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId)
                renderOrderSummary();
                renderPaymentSummary();
                renderCheckoutHeader();
            });
    });
}
