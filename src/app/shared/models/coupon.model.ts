import { Metadata } from './product.model';


export interface Coupon {
    id: number;
    code: string;
    amount: string
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    discount_type: string;
    description: string;
    date_expires: string;
    date_expires_gmt: string;
    usage_count: number;
    individual_use: boolean;
    product_ids: number[];
    excluded_prduct_ids: number[];
    usage_limit: number
    usage_limit_per_user: number;
    limit_usage_to_x_item: number;
    free_shipping: boolean;
    product_categories: number[];
    excluded_product_categories: number[];
    exclude_sale_items: boolean;
    minimum_amount: string;
    maximum_amount: string;
    email_restrictions: string[];
    used_by: Array<number | string>;
    meta_data: Metadata[];
}