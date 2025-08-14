import { updateCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader() {
    const cartQuantity = updateCartQuantity();
    document.querySelector('.js-header-content')
        .innerHTML = `
            <div class="checkout-header-left-section">
            <a href="amazon.html">
                <img class="amazon-logo" src="images/amazon-logo.png">
                <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
            </a>
            </div>

            <div class="checkout-header-middle-section js-checkout-cart-quantity">
            Checkout (<a class="return-to-home-link"
                href="amazon.html">${cartQuantity} items</a>)
            </div>

            <div class="checkout-header-right-section">
            <img src="images/icons/checkout-lock-icon.png">
            </div>
            `;
}