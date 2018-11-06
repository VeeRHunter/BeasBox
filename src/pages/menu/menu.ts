import { Component, ViewChild, OnInit }               from '@angular/core';

import { IonicPage, Nav, NavController, NavParams, AlertController, LoadingController, ToastController }      from 'ionic-angular';

import { UserAuthService }          from '../../app/shared/services/user-auth.service';
import { DataService }        from '../../app/shared/services/data.service';
import { HelperService }        from '../../app/shared/services/helper.service';
import { WooCommerceService }   from '../../app/shared/services/woocommerce.service';
import { AppUser }              from '../../app/shared/models/app-user.model';
import { Category } from '../../app/shared/models/category.model';

import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';
import { LoginResponse } from '../../app/shared/models/login-response.model';
import { Storage } from '@ionic/storage';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  @ViewChild(Nav) nav: Nav;
  menuRoot: string = 'HomePage';  // TabsPage

  curPage: string;
  appUser: AppUser;
  usernameObservable: Observable<string>;
  catList: Category[];

  categoryIcons: string[] = [
    'bug',
    'code',
    'browsers',
    'grid'
  ];

  pages: PageInterface[] = [
    { title: 'Precurated', pageName: 'TabsPage', tabComponent: 'PreCuratedPage', index: 0, icon: 'home' },
    { title: 'Bundle', pageName: 'TabsPage', tabComponent: 'BundleItemsPage', index: 1, icon: 'contacts' },
    { title: 'Can\'t find', pageName: 'TabsPage', tabComponent: 'CustomBoxPage', index: 1, icon: 'contacts' },
    { title: 'My Orders', pageName: 'TabsPage', tabComponent: 'MyOrdersPage', index: 1, icon: 'contacts' },
    { title: 'My Cart', pageName: 'TabsPage', tabComponent: 'ShoppingCartPage', index: 1, icon: 'contacts' },
  ];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public storage: Storage,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private authService: UserAuthService,
              private dataService: DataService,
              private helperService: HelperService,
              private wooService: WooCommerceService) { 
  }

  async ionViewWillEnter() {
    this.authService.appUser$.subscribe((appUser: AppUser) => {
      this.appUser = appUser;
      console.log(this.appUser)
    });
    this.usernameObservable = this.authService.appUser$.map(user => {
      if(!user) return '';
      return user.billingAddress.first_name + " " + user.billingAddress.last_name
    });
    this.helperService.curPage$.subscribe((page) => this.curPage = page);
    this.getCategories();
  }

  ionViewCanEnter(): boolean {
    let bool: boolean;
    this.authService.getAuthenticatedUser()
      .subscribe((user: firebase.User) => {
        bool = (!user) ? false : true;
      });
      return bool;
  }

  async getCategories() {
    this.catList = await this.wooService.getAllCategories();
  }

  setRoot(page: string) {    
    this.menuRoot = page;
    this.nav.setRoot(page);
  }

  doLogout() {
    let load = this.loadingCtrl.create({ content: 'Signing out...' });

    load.present();

    load.onDidDismiss(() => {
      let msg: string = !this.appUser ? 'Error: Logout failed' : 'Success: Logged out';
      this.handleToast(msg);
    });

    this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('logout cancelled');
          }
        }, {
          text: 'Logout',
          handler: () => {
            this.authService.logout().then(() => {
              load.dismiss();
              this.navCtrl.popToRoot()
                .then(() => this.navCtrl.setRoot('LoginPage'));
            });
          }
        }
      ]
    }).present();

    console.log('auth = ' + this.appUser.name);
  }

  navProfile() {
    if (this.nav.getActiveChildNav()) {
      this.nav.getActiveChildNav().push('ProfilePage');
    } else {
      this.nav.setRoot("ProfilePage");
    }
  }

  navHome() {
    // if (this.menuRoot === 'TabsPage') this.nav.getActiveChildNavs[0].select(0);
    // else this.nav.setRoot('TabsPage', { selectedIndex: 0 });
    if (this.nav.getActiveChildNav()) {
      this.nav.getActiveChildNav().push('HomePage');
    } else {
      this.nav.setRoot("HomePage");
    }
  }

  async navPreCurated() {
      // this.nav.setRoot('PreCuratedPage');
      await this.storage.set('selected_category', 'Precurated');
      await this.storage.set('selected_subcategory', "All");
      if (this.nav.getActiveChildNav()) {
        this.nav.getActiveChildNav().push('PreProductsPage');
      } else {
        this.nav.setRoot("PreProductsPage");
      }

      // let params = {};

      // // The index is equal to the order of our tabs inside tabs.ts
      // if (page.index) {
      //   params = { tabIndex: page.index };
      // }
          
      // // The active child nav is our Tabs Navigation
      // if (this.nav.getActiveChildNav() && page.index != undefined) {
      //   this.nav.getActiveChildNav().select(page.index);
      // } else {
      //   // Tabs are not active, so reset the root page 
      //   // In this case: moving to or from SpecialPage
      //   this.nav.setRoot(page.pageName, params);
      // }
  }

  async navBundleItems() {
    // this.nav.setRoot('BundleItemsPage');
    await this.storage.set('selected_category', 'Precurated');
    await this.storage.set('selected_subcategory', "All");
    // this.nav.setRoot('BundleItemsPage');
    if (this.nav.getActiveChildNav()) {
      this.nav.getActiveChildNav().push('BundleProductsPage');
    } else {
      this.nav.setRoot("BundleProductsPage");
    }
  }

  navCustomBox() {
    if (this.nav.getActiveChildNav()) {
      this.nav.getActiveChildNav().push('CustomBoxPage');
    } else {
      this.nav.setRoot("CustomBoxPage");
    }
  }

  navMyOrders() {
    if (this.nav.getActiveChildNav()) {
      this.nav.getActiveChildNav().push('MyOrdersPage');
    } else {
      this.nav.setRoot("MyOrdersPage");
    }
  }

  navMyCart() {
    if (this.nav.getActiveChildNav()) {
      this.nav.getActiveChildNav().push('ShoppingCartPage');
    } else {
      this.nav.setRoot("HomePage");
      this.nav.push("ShoppingCartPage");
    }
  }

  showAllCategories() {
    this.nav.getActiveChildNavs()[0].select(1);
  }

  private handleToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 500
    }).present();
  }

  private async logoutAlert() {
    this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('logout cancelled');
          }
        }, {
          text: 'Logout',
          handler: () => {
            this.authService.logout().then(() => {
              this.navCtrl.popToRoot()
                .then(() => this.navCtrl.setRoot('LoginPage'));
            });
          }
        }
      ]
    }).present();
  }

}
