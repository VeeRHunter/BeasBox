import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';

import { AppUser } from '../models/app-user.model';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { Item } from '../models/item.model';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';

@Injectable()
export class ShoppingCartService {

    cart: Cart = new Cart();
    constructor(public storage: Storage,
        private afDb: AngularFireDatabase,
        // private authService: UserAuthService
    ) {
        this.createOrLoadCart();
    }

    public async createOrLoadCart() {
        let c = await this.getCartFromStorage()
        if (c == null) {
            this.cart = new Cart();
            await this.saveCartToStorage();
            return await this.saveCartToFirebase();
        } else
            this.cart = c
    }

    public async getCartFromStorage() {
        return await this.storage.get('cart');
    }

    public getCartFromFirebase(cartId: string): AngularFireObject<Cart> {
        return this.afDb.object<Cart>('/shopping-carts' + cartId);
    }

    private async saveCartToStorage(): Promise<any> {
        await this.storage.set('cart', this.cart)
        console.log(this.cart)
        return;
    }

    private async saveCartToFirebase(): Promise<any> {
        return this.afDb.list('/shopping-carts').push(this.cart);
    }

    private async updateItemQuantity(product: Product, change: number): Promise<Cart> {
        //if no items, add 1
        if (this.cart.items == null || this.cart.items.length == 0) {
            let newItem = new Item(product, 0);
            if (change > 0) {
                newItem.quantity += change;
                this.cart.items.push(newItem);
            }
        } else {
            //if items already exists
            let isNew = true
            let existingIndex = null;
            for (let myItem of this.cart.items) {

                let index = this.cart.items.indexOf(myItem);
                let p = this.cart.items[index].product;

                if (p.id === product.id) {
                    isNew = false
                    existingIndex = index
                    break;
                }
            }
            //if product is already in cart
            if (!isNew) {
                let q: number = this.cart.items[existingIndex].quantity + change;
                if (q === 0) this.cart.items.splice(existingIndex, 1);
                else this.cart.items[existingIndex].quantity = q;
            }
            //else add product to cart
            else {
                let newItem = new Item(product, 0);
                if (change > 0) {
                    newItem.quantity += change;
                    this.cart.items.push(newItem);
                }
            }
        }
        await this.saveCartToStorage();
        return this.cart;
    }

    public async incrementItem(product: Product): Promise<Cart> {
        return await this.updateItemQuantity(product, 1);
    }

    public async decrementItem(product: Product): Promise<Cart> {
        return await this.updateItemQuantity(product, -1);
    }

    public async removeItem(item: Item): Promise<Cart> {
        this.cart.items = this.cart.items.filter((i: Item) => {
            console.log(i)
            console.log(item)
            return i.product.id != item.product.id
        })
        await this.saveCartToStorage()
        return this.cart;
        // this.alertCtrl.create({
        //     title: 'Remove Cart Item',
        //     message: 'Are you sure you want to remove all of these?',
        //     buttons: [{
        //         text: 'Cancel',
        //         role: 'cancel',
        //         handler: () => {
        //         console.log('cancel remove cart item');
        //         }
        //     }, {
        //         text: 'Remove Item',
        //         handler: () => {

        //         }
        //     }]
        // }).present();
    }

    public emptyCart() {
        this.cart.items = [];
        this.saveCartToStorage();
    }
}