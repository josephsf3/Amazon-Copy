import dayjs from 'dayjs';

function isWeekend(day) {
    return day === 'Saturday' || day === 'Sunday'
}


export function getDeliveryDateBackend(deliveryOption) {
    const today = dayjs();
    let countOfDays = 0;
    let daysRemaining;
    deliveryOptions.forEach((option)=>{
        if (option.id === deliveryOption) {
            daysRemaining = option.deliveryDays;
        }
    });

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
    return deliveryDate;
}


export const deliveryOptions = [{
    id : '1',
    deliveryDays : 7,
    price : 0
}, {
    id : '2',
    deliveryDays : 3,
    price : 499
}, {
   id : '3',
    deliveryDays : 1,
    price : 999
}];