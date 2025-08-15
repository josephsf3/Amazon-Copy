import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export function getDeliveryOption(deliveryOptionId) {
    let deliveryOption;
    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }
    });
    return deliveryOption || deliveryOptions[0];
}

function isWeekend(day) {
    return day === 'Saturday' || day === 'Sunday'
}


export function getDeliveryDate(deliveryOption) {
    const today = dayjs();
    let countOfDays = 0;
    let daysRemaining = deliveryOption.deliveryDays;
    console.log(daysRemaining)

    while (daysRemaining > 0) {
        countOfDays++;
        const date = today.add(countOfDays, 'days');
        const dayName = date.format('dddd');

        if (isWeekend(dayName)) {
            continue; // skip weekends
        }
        daysRemaining--;
    }

    const deliveryDate = today.add(countOfDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    console.log(dateString);
    return dateString;
}


export const deliveryOptions = [{
    id : '1',
    deliveryDays : 1,
    price : 0
}, {
    id : '2',
    deliveryDays : 3,
    price : 499
}, {
   id : '3',
    deliveryDays : 7,
    price : 999
}];