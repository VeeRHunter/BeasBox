import { Billing }  from './billing.model';
import { Cart } from './cart.model';
import { Shipping } from './shipping.model';

export interface AppUser {
    id: string;
    name: string;
    email: string;

    isAdmin?: boolean;

    gender?: string;                // "female" "male"  "other"
    status?: string;                // "single"  "married"  "relationship"
    relationAnniversary?: string;       
    billingAddress?: Billing;
    birthday?: string;                // My birthday
    partnerBirthday?: string;         // Partner's birthday
    partnerAnniversary?: string;    
    specialDays?: Array<{type: string, day:string, name: string}>;
    additional?: string;

    cart?: Cart;
    shippingAddresses?: Shipping[];
}