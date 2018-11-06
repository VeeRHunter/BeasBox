export interface Product {
    id:                    number,
    name:                  string,
    slug:                  string,
    permalink:             string,
    date_created:          string,
    date_created_gmt:      string,
    date_modified:         string,
    date_modified_gmt:     string,
    type:                  string,
    status:                string,
    featured:              boolean,
    catalog_visibility:    string,
    description:           string,
    short_description:     string,
    sku:                   string,
    price:                 string,
    regular_price:         string,
    sale_price:            string,
    date_on_sale_from:     string,
    date_on_sale_from_gmt: string,
    date_on_sale_to:       string,
    date_on_sale_to_gmt:   string,
    price_html:            string,
    on_sale:               boolean,
    purchasable:           boolean,
    total_sales:           number,
    virtual:               boolean,
    downloadable:          boolean,
    downloads:             Download[],
    download_limit:        number,
    download_expiry:       number,
    external_url:          string,
    button_text:           string,
    tax_status:            string,
    tax_class:             string,
    manage_stock:          boolean,
    stock_quantity:        number,
    in_stock:              boolean,
    backorders:            string,
    backorders_allowed:    boolean,
    backordered:           boolean,
    sold_individually:     boolean,
    weight:                string,
    dimensions:            Dimension,
    shipping_required:     boolean,
    shipping_taxable:      boolean,
    shipping_class:        string,
    shipping_class_id:     number,
    reviews_allowed:       boolean,
    average_rating:        string,
    rating_count:          number,
    related_ids:           number[],
    upsell_ids:            number[],
    cross_sell_ids:        number[],
    parent_id:             number,
    purchase_note:         string,
    categories:            Category[],
    tags:                  Tag[],
    images:                Image[],
    attributes:            Attribute[],
    default_attributes:    DefaultAttribute[],
    variations:            number[],
    grouped_products:      number[],
    menu_order:            number,
    meta_data:             Metadata[]
}

interface Dimension {
    length:  string;
    width:   string;
    height:  string;
}

interface Category {
    id:   number;
    name: string;
    slug: string;
}

export interface Image {
    id:                number;
    date_created:      string;
    date_created_gmt:  string;
    date_modified:     string;
    date_modified_gmt: string;
    src:               string;
    name:              string;
    alt:               string;
    position:          number;
}

interface Download {
    id:   string;
    name: string;
    file: string;
}

interface Tag {
    id:   string;
    name: string;
    slug: string;
}

export interface Attribute {
    id:        number;
    name:      string;
    position:  number;
    visible:   boolean;
    variation: boolean;
    options:   any[];
}

interface DefaultAttribute {
    id:     number;
    name:   string;
    option: string;
}

export interface Metadata {
    id:    number;
    key:   string;
    value: string;
}



