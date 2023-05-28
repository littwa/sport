export interface DeliveryDays {
    Mon: boolean;
    Wed: boolean;
    Fri: boolean;
    Tue: boolean;
    Thu: boolean;
    Sat: boolean;
    Sun: boolean;
}

export interface IDate {
    date: { type: string; required: true };
    timezone_type: { type: string; required: true };
    timezone: { type: string; required: true };
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
    kg?: string;
    pcs?: string;
    box?: string;
}

export interface IAddress {
    country?: string;
    region?: string;
    city?: string;
    street?: string;
}

export interface IOrderData {
    firstName?: string;
    lastName?: string;
    email?: string;
    tel?: string;
}
