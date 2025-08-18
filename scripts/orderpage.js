import {orders} from '../data/orders.js';
import {getProduct, loadProductsFetch} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import {addToCartFromOrders,updateCartQuantity} from '../data/cart.js';
function timeConversion(time) {
  return dayjs(time).format('MMMM D');
}
function updateCartQuantityOrders() {
  document.querySelector('.js-cart-quantity')
    .innerHTML = updateCartQuantity();
}

updateCartQuantityOrders();

loadProductsFetch().then(() => {
  let finalHTML = '';
  orders.forEach((orderItem) => {
    let internalHTML = '';
    orderItem.products.forEach((product) => {
      const matchingProduct = getProduct(product.productId);
      internalHTML += `
          <div class="product-image-container">
            <img src="${matchingProduct.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${timeConversion(product.estimatedDeliveryTime)}
            </div>
            <div class="product-quantity">
              Quantity: ${product.quantity}
            </div>
            <button class="buy-again-button button-primary js-buy-again" data-product-id = "${product.productId}" data-product-quantity="${product.quantity}">
              <img class="buy-again-icon" src="images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="tracking.html?orderId=${orderItem.id}&productId=${product.productId} ">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
      `;
    });
    let inHTML = `
      <div class="order-container">  
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${timeConversion(orderItem.orderTime)}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(orderItem.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${orderItem.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${internalHTML}
          </div>
        </div>
    `
    finalHTML += inHTML;
  });
  document.querySelector('.js-orders-grid')
    .innerHTML = finalHTML;

  document.querySelectorAll('.js-buy-again')
    .forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const productQuantity = Number(button.dataset.productQuantity)
        addToCartFromOrders(productId,productQuantity);
        updateCartQuantityOrders();
      });
    });
});




