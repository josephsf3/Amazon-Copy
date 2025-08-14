export const cart = JSON.parse(localStorage.getItem('cart')) || [];

export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function  addToCart(productId) {
    let matchingItem;
    cart.forEach(cartItem => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    });
    const selectedQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
    if (matchingItem) {
        matchingItem.quantity += selectedQuantity;;
    } else {
    cart.push({
        productId: productId,
        quantity: selectedQuantity,
        deliveryOptionId : '1'
    });
    }
    saveToStorage();
}

export function removeFromCart(productId) {
    const index = cart.findIndex(cartItem => cartItem.productId === productId);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    saveToStorage();
}

export function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach(cartItem => {
        cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
}