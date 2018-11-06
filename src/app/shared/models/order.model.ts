import { Billing } from './billing.model';
import { Shipping } from './shipping.model';
import { Metadata } from './product.model';


export interface Order {
    id: number;
    parent_id: number;
    number: string;
    order_key: string;
    created_via: string;
    version: number;
    status: string;
    currency: string;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    cart_tax: string;
    total: string;
    total_tax: string;
    price_includes_tax: boolean;
    customer_id: number;
    customer_ip_address: string;
    customer_user_agent: string;
    customer_note: string;
    billing: Billing;
    shipping: Shipping;
    payment_method: string;
    payment_method_title: string;
    transaction_id: string;
    date_paid: string;
    date_paid_gmt: string;
    date_completed: string;
    date_completed_gmt: string;
    cart_hash: string;
    meta_data: Metadata[];
    line_items: LineItem[];
    tax_lines: TaxLine[];
    shipping_lines: ShippingLine[];
    fee_lines: FeeLine[];
    coupon_lines: CouponLine[];
    refunds: Refund[];
    set_paid: boolean;
}

export interface LineItem {
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: number;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: Tax[];
    meta_data: Metadata[];
    sku: string;
    price: string;

}

interface TaxLine {
    id: number;
    rate_code: string;
    rate_id: string;
    label: string;
    compound: boolean;
    tax_total: string;
    shipping_tax_total: string;
    meta_data: Metadata[];
}

export interface ShippingLine {
    id: number;
    method_title: string;
    method_id: string;
    total: string;
    total_tax: string;
    taxes: Tax[];
    meta_data: Metadata[];
}

interface FeeLine {
    id: number;
    name: string;
    tax_class: string;
    tax_status: string;
    total: string;
    total_tax: string;
    taxes: Tax[];
    meta_data: Metadata[];
}

interface CouponLine {
    id: number;
    code: string;
    discount: string;
    discount_tax: string;
    meta_data: Metadata[];
}

interface Refund {
    id: number;
    reason: string;
    total: string;
}

interface Tax {
    subtotal: string[];
    total: string[];
}

export interface Checkout {
    payment_method: string,
    payment_method_title: string,
    set_paid: boolean,
    billing: Billing,
    shipping: Shipping,
    line_items: Array<LineItem>,
    shipping_lines: Array<any> // ShippingLine
}