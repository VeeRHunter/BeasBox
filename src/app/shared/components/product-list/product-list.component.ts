import { Component, Input, OnInit } from '@angular/core';

import { NavController }    from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Product }          from '../../models/product.model';

import { Item } from '../../models/item.model';
import { Cart } from '../../models/cart.model';


@Component({
    selector: 'product-list',
    templateUrl: 'product-list.html'
})
export class ProductListComponent implements OnInit {

    @Input() 
    product: Product;
    
    cart: Cart;

    constructor(public navCtrl: NavController, 
                private cartService: ShoppingCartService,
                public storage: Storage) {
    }

    ngOnInit() {
        this.cartService.getCartFromStorage().then((cart: Cart) => this.cart = cart);
    }

    showProductDetails() {
        this.navCtrl.push('ProductDetailsPage', { product: this.product });
    }
}