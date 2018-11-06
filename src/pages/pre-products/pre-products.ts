import { Component, 
        OnInit, 
        OnDestroy }            from '@angular/core';

import { IonicPage, 
         NavController, 
         NavParams }           from 'ionic-angular';
import { Storage } from '@ionic/storage';

import {ToolbarAnimation }     from '../../animations/toolbar.animation';
import { UserAuthService }     from '../../app/shared/services/user-auth.service';
import { HelperService }       from '../../app/shared/services/helper.service';
import { WooCommerceService }  from '../../app/shared/services/woocommerce.service';
import { ShoppingCartService } from '../../app/shared/services/shopping-cart.service';

import { AppUser }             from '../../app/shared/models/app-user.model';
import { Product }             from '../../app/shared/models/product.model';
import { Item }                from '../../app/shared/models/item.model';
import { Cart }                from '../../app/shared/models/cart.model';

@IonicPage()
@Component({
  selector: 'page-pre-products',
  templateUrl: 'pre-products.html',
  animations: [
    ToolbarAnimation
  ]
})
export class PreProductsPage {

  appUser: AppUser;
  selectedView: string = "grid";
  curSize: number;

  productList: Product[];
  category = "Precurated";
  selectedFilter = "All";
  search = "";
  cart: Cart;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private wooService: WooCommerceService,
              private authService: UserAuthService, 
              private helperService: HelperService,
              private cartService: ShoppingCartService,
              public storage: Storage) {
  }

  async ionViewWillEnter() {
      this.authService.appUser$.subscribe((user) => {
        if (!user) return;
        this.appUser = user;
      });
      this.cartService.getCartFromStorage().then((cart: Cart) => this.cart = cart);
      this.helperService.selectedView$.subscribe((view) => { this.selectedView = "grid"; /*view*/   });
      this.helperService.gridSize$.subscribe((size) => this.curSize = size);
      this.productList = await this.wooService.getPrecuratedProducts();
  }

  async filterChanged($event) {
    console.log($event);
    this.productList = await this.wooService.getFilterProducts(this.category, $event.value);
  }

  async onModifySearch() {
      this.productList = await this.wooService.getSearchProducts(this.category, this.search);
  }

  async onCancelSearch() {
    console.log("Search canceled!");
  }

  showProductDetails(p: Product) {
    this.navCtrl.push('ProductDetailsPage', { product: p });
  }

  onShowCart() {
    this.navCtrl.push("ShoppingCartPage");
  }

  goBack() {
    this.navCtrl.pop();
  }
  
}
