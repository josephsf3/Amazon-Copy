import { getDeliveryDateBackend, deliveryOptions } from "./delivery.js";

export function formatCart(cartItem) {
    const productId = cartItem.productId;
    const quantity = cartItem.quantity;
    const estimatedDeliveryTime = getDeliveryDateBackend(cartItem.deliveryOptionId);
    const deliveryCost = deliveryOptions.find(deliveryId => deliveryId.id === cartItem.deliveryOptionId);

    return {
        productId: productId,
        quantity: quantity,
        estimatedDeliveryTime: estimatedDeliveryTime,
        deliveryCost: deliveryCost.price
    }
}


export function calculateCost(data, products) {
    let totalCostCents = 0;

    data.forEach(element => {
        const product = products.find(p => p.id === element.productId);
        if (product) {
            totalCostCents += product.priceCents * element.quantity;
            totalCostCents += element.deliveryCost;
            
        }
    });
    const tax = (Math.round((totalCostCents * 0.10) * 100) / 100)
    totalCostCents += tax;

    return totalCostCents;
}