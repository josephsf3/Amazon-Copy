export const cart = [
    {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1
    }
]; 

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
        quantity: selectedQuantity
    });
    }
}

export function removeFromCart(productId) {
    const index = cart.findIndex(cartItem => cartItem.productId === productId);
    if (index !== -1) {
        cart.splice(index, 1);
    }
}