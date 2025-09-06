import { getDeliveryDateBackend } from "./date.js";

export function formatCart(cartItem) {
    const productId = cartItem.productId;
    const quantity = cartItem.quantity;
    const estimatedDeliveryTime = getDeliveryDateBackend(cartItem.deliveryOptionId);

    return {
        productId: productId,
        quantity: quantity,
        estimatedDeliveryTime: estimatedDeliveryTime
    }
}


export function calculateCost(data, products) {
    let totalCostCents = 0;

    data.forEach(element => {
        const product = products.find(p => p.id === element.productId);
        if (product) {
            totalCostCents += product.priceCents * element.quantity;
        }
    });

    return totalCostCents;
}