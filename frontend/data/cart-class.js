class Cart {
    cartItems;
    #localStorageKey; //Private Property

    constructor(localStorageKey) {
        this.#localStorageKey = localStorageKey;
        this.#loadFromStorage();
    }

    saveToStorage() {
        this.cartItems = localStorage.setItem(this.#localStorageKey, JSON.stringify(cart));
    }
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
        saveToStorage();
    }
    #loadFromStorage () {
        this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey)) || [];
    }
    removeFromCart(productId) {
        const index = cart.findIndex(cartItem => cartItem.productId === productId);
        if (index !== -1) {
            this.cartItems.splice(index, 1);
        }
        saveToStorage();
    }
    updateCartQuantity() {
        let cartQuantity = 0;
        this.cartItems.forEach(cartItem => {
            cartQuantity += cartItem.quantity;
        });
        return cartQuantity;
    }
    updateDeliveryOption (productId, deliveryOptionId) {
        let matchingItem;
        this.cartItems.forEach(cartItem => {
            if (cartItem.productId === productId) {
                matchingItem = cartItem;
            }
        });

        matchingItem.deliveryOptionId = deliveryOptionId;
        saveToStorage();
        }
}



const cart = new Cart('cart');
const businessCart = new Cart('business-cart');
console.log(cart)
console.log(businessCart)