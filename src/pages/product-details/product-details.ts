import { Component, OnInit, OnDestroy }           from '@angular/core';

import { IonicPage, NavController, NavParams, ToastController }     from 'ionic-angular';
import { Storage }             from '@ionic/storage';

import { UserAuthService }         from '../../app/shared/services/user-auth.service';
import { ShoppingCartService } from '../../app/shared/services/shopping-cart.service';
import { HelperService }       from '../../app/shared/services/helper.service';
import { Product }             from '../../app/shared/models/product.model';
import { AppUser }             from '../../app/shared/models/app-user.model';
import { Cart }                from '../../app/shared/models/cart.model';
import { Item }                from '../../app/shared/models/item.model';


@IonicPage()
@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage{

  appUser: AppUser;
  product: Product;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private authService: UserAuthService, 
              private cartService: ShoppingCartService,
              private helperService: HelperService,
              private toastCtrl: ToastController,
              public storage: Storage) {

    this.product = this.navParams.data.product;
    console.log(this.product)
  }

  ionViewWillEnter() {
    this.authService.appUser$.subscribe((user) => {
      if (!user) return;
      this.appUser = user;
    });    
  }

  async addToCart() {
    await this.cartService.incrementItem(this.product);
    this.navCtrl.push("ShoppingCartPage");
  }
  
  onShowCart() {
    this.navCtrl.push("ShoppingCartPage");
  }

  goBack() {
    this.navCtrl.pop();
  }
}
