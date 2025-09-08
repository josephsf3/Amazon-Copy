import {renderOrderSummary} from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";
//import '../data/cart-oops.js';
//import '../data/cart-class.js';
//import '../data/backend-practise.js';

async function loadPage() {
    try {
        //throw 'error';
        await loadProductsFetch();
        await new Promise((resolve, reject) => {
            //throw 'error';
            loadCart(() => {
                //reject('error');
                resolve();
            });
        });
    } catch (error) {
        console.log('Error');
    }
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();

}
loadPage();

/*
Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadProducts(() => {
            resolve();
        });
    }),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })
]).then(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
new Promise((resolve) => {
    loadProducts(() => {
        resolve();
    });
}).then(() => {
    return new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    });
}).then(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
});
*/
/*
loadProducts(() => {
    renderCheckoutHeader();
    renderOrderSummary();
    renderPaymentSummary();
});
*/
