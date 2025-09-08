export function Cart(localStorageKey) {
    const cart = {
        cartItems : undefined,
        saveToStorage() {
            this.cartItems = localStorage.setItem(localStorageKey, JSON.stringify(cart));
        },
        addToCart(productId) {
            let matchingItem;
            this.cartItems.forEach(cartItem => {
                if (cartItem.productId === productId) {
                    matchingItem = cartItem;
                }
            });
            const selectedQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
            if (matchingItem) {
                matchingItem.quantity += selectedQuantity;;
            } else {
            this.cartItems.push({
                productId: productId,
                quantity: selectedQuantity,
                deliveryOptionId : '1'
            });
            }
            this.saveToStorage();
        },
        loadFromStorage () {
            this.cartItems = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        },
        removeFromCart(productId) {
            const index = this.cartItems.findIndex(cartItem => cartItem.productId === productId);
            if (index !== -1) {
                this.cartItems.splice(index, 1);
            }
            this.saveToStorage();
        },
        updateCartQuantity() {
            let cartQuantity = 0;
            this.cartItems.forEach(cartItem => {
                cartQuantity += cartItem.quantity;
            });
            return cartQuantity;
        },
        updateDeliveryOption (productId, deliveryOptionId) {
            let matchingItem;
            this.cartItems.forEach(cartItem => {
                if (cartItem.productId === productId) {
                    matchingItem = cartItem;
                }
            });

            matchingItem.deliveryOptionId = deliveryOptionId;
            this.saveToStorage();
        }

    }
    return cart;
}


const cart = Cart('cart');
const businessCart = Cart('business-cart');
cart.loadFromStorage();
businessCart.loadFromStorage();
console.log(cart)
console.log(businessCart)