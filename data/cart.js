export const cart = []; 

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