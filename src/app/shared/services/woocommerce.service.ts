import { Injectable }   from '@angular/core';
import { environment }  from '../../../environments/environment';

import { Product, Attribute, Metadata } from '../models/product.model';
import { Category }     from '../models/category.model';

import * as WooCommerce from 'woocommerce-api';
import { Storage } from '@ionic/storage';

@Injectable()
export class WooCommerceService {

    wooCommerce: any;
    selected_subcategory: string;

    constructor( public storage: Storage,) {
        this.wooCommerce = WooCommerce(environment.wooCommerceApiConfig);
    }

    public async getAllCategories() {
        try { 
            let catList = await this.wooCommerce.getAsync('products/categories');
            let parsedList: Category[] =  JSON.parse(catList.toJSON().body);
            console.log('Category list = ',  ...parsedList);
            await this.storage.set('categoryList', parsedList);
            return parsedList;
        }
        catch (error) { return null }
    }

    public async getAllTaxRates() {
        try { 
            let taxList = await this.wooCommerce.getAsync('taxes?per_page=100');
            let parsedList: Category[] =  JSON.parse(taxList.toJSON().body);
            console.log('TaxRates list = ',  ...parsedList);
            return parsedList;
        }
        catch (error) { return null }
    }

    public async placeOrder(data: any) {
        try { 
            await this.wooCommerce.post('orders', data, function(err, data, res) {
                console.log(res);
                // alert("Order placed successfully !");
                // this.alertCtrl.create({
                //     subTitle: "Order Placed Successfully",
                //     buttons: [{
                //         text: "OK",
                //         handler: () => {}
                //     }]
                // }).present();
            });
        } catch (error) { return null }
    }

    public async getPrecuratedProducts() {
        return this.getSubCateProducts('Precurated');
    }

    public async getBundleProducts() {
        return this.getSubCateProducts('BeesBundle');
    }

    public async getSubCateProducts(cate_name: string) {
        let cate_id = null;

        let categories: Category[] = await this.storage.get('categoryList');
        let index = categories.findIndex(c => c.name == cate_name);
        if(index >= 0) cate_id = categories[index].id;
        else return [];

        try {
            let list = await this.wooCommerce.getAsync('products?per_page=100&category=' + cate_id);
            let parsedList: Product[] = JSON.parse(list.toJSON().body);

            this.selected_subcategory = await this.storage.get('selected_subcategory');
            let self = this;
            if(this.selected_subcategory != 'All') {
                parsedList = parsedList.filter((p: Product) => {
                    let attrs: Metadata[] = p.meta_data;

                    let i1 = attrs.findIndex((attr:Metadata) => attr.key == 'sub-categories');
                    // let i2 = attrs.findIndex((attr:Metadata) => attr.key == 'filters');
                    if(i1 >= 0)   return attrs[i1].value === self.selected_subcategory;
                    else return false;
                });
            }
            console.log('Subcategory Products = ', ...parsedList);
            return parsedList;
        }
        catch (error) { console.error(error); return null }
    }
    
    public async getFilterProducts(category: string, filters: string) {
        let cate_id = null;

        let categories: Category[] = await this.storage.get('categoryList');
        let index = categories.findIndex(c => c.name == category);
        if(index >= 0) cate_id = categories[index].id;
        else return [];

        try {
            let list = await this.wooCommerce.getAsync('products?per_page=100&category=' + cate_id);
            let parsedList: Product[] = JSON.parse(list.toJSON().body);
            if(filters != 'All') {
                parsedList = parsedList.filter((p: Product) => {
                    let attrs: Metadata[] = p.meta_data;
                    let index = attrs.findIndex((attr:Metadata) => attr.key == 'filters');
                    if(index >= 0)   return attrs[index].value === filters;
                    else return false;
                });
            }
            console.log('Subcategory Products = ', ...parsedList);
            return parsedList;
        }
        catch (error) { console.error(error); return null }
    }

    public async getSearchProducts(category: string, search: string) {
        let cate_id = null;

        let categories: Category[] = await this.storage.get('categoryList');
        let index = categories.findIndex(c => c.name == category);
        if(index >= 0) cate_id = categories[index].id;
        else return [];

        try {
            let list = await this.wooCommerce.getAsync('products?per_page=100&category=' + cate_id + '&search=' + search);
            let parsedList: Product[] = JSON.parse(list.toJSON().body);

            console.log('Searched Products = ', ...parsedList);
            return parsedList;
        }
        catch (error) { console.error(error); return null }
    }

    public async getProduct(productId: string) {
        try { 
            let sProduct = await this.wooCommerce.getAsync('products/' + productId+'&per_page=100');
            let parsedProduct: Product[] = JSON.parse(sProduct.toJSON().body);
            console.log('selected Product = ', parsedProduct);
            return parsedProduct;
        }
        catch (error) { return null }
    }
}