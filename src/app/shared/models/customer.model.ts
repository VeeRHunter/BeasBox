import { Billing } from './billing.model'
import { Shipping } from './shipping.model';
import { Metadata } from './product.model';


export interface Customer {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    username: string;
    password: string;
    billing: Billing;
    shipping: Shipping;
    is_paying_customer: boolean;
    order_counts: number;
    total_spent: string;
    avatar_url: string;
    meta_data: Metadata[];
}