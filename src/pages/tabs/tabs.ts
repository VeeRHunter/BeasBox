import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserAuthService } from '../../app/shared/services/user-auth.service';
import { HelperService } from '../../app/shared/services/helper.service';
//import { ShoppingCartService } from '../../app/shared/services/shopping-cart.service';
import { AppUser } from '../../app/shared/models/app-user.model';
import { Cart } from '../../app/shared/models/cart.model';
import { Item } from '../../app/shared/models/item.model';

import * as firebase from 'firebase';

export interface Page {
  rootPage: string;
  title: string;
  icon: string;
}


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  appUser: AppUser;
  cart: Cart;
  selectedIndex: number = 0;
  tabList: Page[] = [
    {
      rootPage: 'HomePage',
      title: 'Home',
      icon: 'person'
    },
    {
      rootPage: 'MyOrdersPage',
      title: 'My Order',
      icon: 'book'
    }, {
      rootPage: 'ShoppingCartPage',
      title: 'My Cart',
      icon: 'cart'
    }
  ];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private authService: UserAuthService,
    private helperService: HelperService,
    // private cartService: ShoppingCartService,
    public storage: Storage) {

    //this.cart = this.cartService.getCart();
    //this.cartCount = this.cart.length || 0;
  }

  async ionViewWillEnter() {
    this.authService.appUser$.subscribe((appUser: AppUser) => {
      this.appUser = appUser;
    });
    if (this.navParams.data) {
      this.selectedIndex = this.navParams.data.selectedIndex;
    }

    console.log(this.appUser);
    //this.cartService.getCart().then((cart: Cart) => this.cart = cart);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  onPageChange(event: Event) {
    let newPage: string = this.navCtrl.getActiveChildNavs()[0].getSelected().root;
    this.helperService.changePage(newPage);
  }

  ngOnDestroy() {
  }

}
