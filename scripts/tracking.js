import { orders } from "../data/orders.js";
import { loadProductsFetch, getProduct } from "../data/products.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

function findOrder(orderId) {
    let matchingOrder;
    orders.forEach((orderItem) => {
        if (orderItem.id === orderId) {
            matchingOrder = orderItem;
        }
    });
    if (matchingOrder) {
        return matchingOrder;
    }
}

function productsInOrder(matchingOrder,productId) {
    let matchingProduct;
    matchingOrder.products.forEach((product) => {
        if (product.productId === productId) {
            matchingProduct = product;
        }
    });
    return matchingProduct;
}

function timeConversion(time) {
    return dayjs(time).format('dddd, MMMM D');
}

function calculateProgress(orderTime, expectedTime) {
    const today = dayjs();
    const orderDate = dayjs(orderTime);
    const delivery = dayjs(expectedTime);
    const elapsed = today.diff(orderDate, "day");
    const total = delivery.diff(orderDate, "day");
    const progress = (elapsed / total) * 100;
    return progress>5?Math.round(progress):5;

}


loadProductsFetch().then(() => {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');
    const matchingOrder = findOrder(orderId);
    const matchingProduct = getProduct(productId);
    const productInOrder = productsInOrder(matchingOrder, productId);





    let html = `
        <div class="order-tracking">
            <a class="back-to-orders-link link-primary" href="orders.html">
            View all orders
            </a>

            <div class="delivery-date">
            Arriving on ${timeConversion(matchingOrder.estimatedDeliveryTime)}
            </div>

            <div class="product-info">
            ${matchingProduct.name}
            </div>

            <div class="product-info">
            Quantity: ${productInOrder.quantity}
            </div>

            <img class="product-image" src=${matchingProduct.image}>

            <div class="progress-labels-container">
            <div class="progress-label">
                Preparing
            </div>
            <div class="progress-label current-status">
                Shipped
            </div>
            <div class="progress-label">
                Delivered
            </div>
            </div>

            <div class="progress-bar-container">
            <div class="progress-bar js-progress-bar"></div>
            </div>
        </div>
    `;
    document.querySelector('.js-render-main')
        .innerHTML = html;
    document.querySelector('.js-progress-bar')
        .style.width = `${calculateProgress(matchingOrder.orderTime, productInOrder.estimatedDeliveryTime)}%`;

});

document.querySelector('.js-search-button')
    .addEventListener('click', () => {
      const query = encodeURIComponent(document.querySelector('.js-search-bar').value);
      window.location.href = `amazon.html?search=${query}`;
    });

