import { Component, OnInit, OnDestroy }           from '@angular/core';

import { IonicPage, NavController, NavParams, AlertController, ToastController }     from 'ionic-angular';
import { Storage }             from '@ionic/storage';

import { UserAuthService }         from '../../app/shared/services/user-auth.service';
import { ShoppingCartService } from '../../app/shared/services/shopping-cart.service';
import { AppUser }             from '../../app/shared/models/app-user.model';
import { Item }                from '../../app/shared/models/item.model';

import { Observable }          from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Cart } from '../../app/shared/models/cart.model';
import { Product } from '../../app/shared/models/product.model';


@IonicPage()
@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage  {

  appUser: AppUser;
  cart: Cart = new Cart();
  subscription: Subscription;
  subtotal: number=0;

  processing = true;
  constructor(
      public navCtrl: NavController, 
      private navParams: NavParams,
      private alertCtrl: AlertController,
      private toastCtrl: ToastController,
      private authService: UserAuthService,
      private cartService: ShoppingCartService,
      public storage: Storage) {            
  }

  async ionViewWillEnter() {
    this.authService.appUser$.subscribe((user) => {
      if (!user) return;
      this.appUser = user;
    });
    return await this.cartService.getCartFromStorage().then((cart: Cart) => {
        this.cart = cart
        this.calc();
    });
  }

  calc() {
    this.subtotal = 0;
    if(this.cart) {
      this.cart.items.forEach(item => {
          this.subtotal += item.quantity * parseFloat(item.product.price)
      });      
    }

    this.processing = false;
  }

  async addQuantity($p: Product) {
    this.processing = true;
    this.cartService.incrementItem($p).then(cart  => {
      this.cart = cart
      this.calc();
    }).catch(err => {
        this.processing = false;
        console.log(err);
    });    
  }

  async subQuantity($p: Product) {
    this.processing = true;
    this.cartService.decrementItem($p).then(cart  => {
      this.cart = cart
      this.calc();
    }).catch(err => {
        this.processing = false;
        console.log(err);
    });    
  }

  async removeItem($i: Item) {
    this.processing = true;
    this.cartService.removeItem($i).then(cart  => {
        this.cart = cart
        this.calc();
    }).catch(err => {
        this.processing = false;
        console.log(err);
    });    
  }
  
  public completeOrder() {
      if(!this.processing)  this.navCtrl.push('CheckoutPage', {cart: this.cart});
  }

  goBack() {
      if(!this.processing) this.navCtrl.pop();
  }

}
