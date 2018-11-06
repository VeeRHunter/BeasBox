import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { ShoppingCartService } from '../../services/shopping-cart.service';
import { UserAuthService } from '../../services/user-auth.service';

import { AppUser } from '../../models/app-user.model';
import { Cart }   from '../../models/cart.model';
import { Item }   from '../../models/item.model';
import { Product } from '../../models/product.model';


@Component({
    selector: 'cart-item',
    templateUrl: 'cart-item.html'
})
export class  CartItemComponent implements OnInit {

    @Input()  item: Item;
    @Output() add = new EventEmitter<Product>();
    @Output() sub = new EventEmitter<Product>();
    @Output() remove = new EventEmitter<Item>();

    AppUser: AppUser;
    // cart: Cart;

    constructor(private authService: UserAuthService, 
                private cartService: ShoppingCartService
    ) {

    }

    ngOnInit() {
        this.authService.appUser$.subscribe((user) => this.AppUser = user);

        // this.cartService.getCartFromStorage()
        //     .then((cart: Cart) => this.cart = cart)
        //     .catch((error) => console.log(error));
    }

    incrementItem() {
        this.add.emit(this.item.product);
    }

    decrementItem() {
        this.sub.emit(this.item.product);
    }

    removeItem() {
        this.remove.emit(this.item);
    }
}