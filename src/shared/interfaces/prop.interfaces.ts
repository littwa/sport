export interface DeliveryDays {
    Mon: boolean,
    Wed: boolean,
    Fri: boolean,
    Tue: boolean,
    Thu: boolean,
    Sat: boolean,
    Sun: boolean,
}

export interface IDate {
    date: { type: String, required: true },
    timezone_type: { type: String, required: true },
    timezone: { type: String, required: true }
}

export interface ICustomer {
    name: string;
    customerNo: string;
    deliveryDays: DeliveryDays;
    shortlistedProducts: string;
    deliveryAddress: string;
    contactName: string;
    mobilePhone: string;
    notifyCustomerMessage: boolean;
}

export interface IPrice {
    kg?: string,
    pcs?: string,
    box?: string
}

