import { Component, Input, OnInit } from '@angular/core';

import { NavController }    from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ShoppingCartService } from '../../services/shopping-cart.service';
import { HelperService } from '../../services/helper.service';
import { Product }          from '../../models/product.model';
import { Item } from '../../models/item.model';
import { Cart }                from '../../models/cart.model';


@Component({
    selector: 'product-grid',
    templateUrl: 'product-grid.html'
})
export class ProductGridComponent implements OnInit {

    @Input() 
    product: Product;

    gridSize: number;
    isInCart: boolean;
    cart: Cart;


    constructor(public navCtrl: NavController, 
                private cartService: ShoppingCartService,
                private helperService: HelperService,
                public storage: Storage) {
        
    }

    ngOnInit() {
        this.cartService.getCartFromStorage().then((cart: Cart) => this.cart = cart);
        this.helperService.gridSize$.subscribe((size: number) => this.gridSize = size);
    }

    showProductDetails() {
        this.navCtrl.push('ProductDetailsPage', { product: this.product });
    }

    toggleAddToCartButton() {
        for (let item of this.cart.items) {
            this.isInCart = (item.product.id === this.product.id) ? true : false;
        }
    }
}