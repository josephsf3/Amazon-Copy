export let cart = JSON.parse(localStorage.getItem('cart')) || [];
// export let cart = [];

// async function loadingCart() {
//     try {
//         const response = await fetch('/api/cart');
//         if (!response.ok) {
//             throw new Error('Failed to fetch cart');
//         }
//         cart = await response.json();
//         return cart;
//     } catch (err) {
//         console.error('Error loading cart:', err);
//         cart = [];
//         return cart;
//     }
// }

// loadingCart();

export async function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    });
    const test = await response.text();
}

export function addToCart(productId) {
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
            deliveryOptionId: '1'
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

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    cart.forEach(cartItem => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;
    saveToStorage();
}

export function loadCart(fun) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
        fun();
    })

    xhr.open('GET', 'https://supersimplebackend.dev/cart');
    xhr.send();
}

export function addToCartFromOrders(productId, selectedQuantity) {
    let matchingItem;
    cart.forEach(cartItem => {
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    });
    if (matchingItem) {
        matchingItem.quantity += selectedQuantity;;
    } else {
        cart.push({
            productId: productId,
            quantity: selectedQuantity,
            deliveryOptionId: '1'
        });
    }
    saveToStorage();
}

export function cartReset() {
    cart = [];
    saveToStorage();
}