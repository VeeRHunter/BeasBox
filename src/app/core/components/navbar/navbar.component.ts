import { Component, OnInit } from '@angular/core';

import { NavController, 
         ActionSheetController, 
         AlertController, 
         LoadingController, 
         ToastController }   from 'ionic-angular';

import { UserAuthService }       from '../../../shared/services/user-auth.service';
import { AppUser }           from '../../../shared/models/app-user.model';
import { HelperService }     from '../../../shared/services/helper.service';
import { ShoppingCartService } from '../../../shared/services/shopping-cart.service';
import { Item } from '../../../shared/models/item.model';
import { Subscription } from 'rxjs/Subscription';
//import { Storage } from '@ionic/storage';
//import { Cart } from '../../../shared/models/cart.model';


@Component({
  selector: 'nav-bar',
  templateUrl: 'navbar.html'
})
export class NavbarComponent implements OnInit{

  //authUser$: Subscription;
  appUser: AppUser;
  headerSize: string ='48px';
  currentPage: string;
  //cart: Cart;

  cartCount: number = 0;
  
  constructor(public navCtrl: NavController, 
              public actionCtrl: ActionSheetController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public authService: UserAuthService,
              public helperService: HelperService,
              public cartService: ShoppingCartService,
              //public storage: Storage
  ) { 


    

    
  }

  async ngOnInit() {
    this.authService.appUser$.subscribe((appUser: AppUser) => {
      //this.appUser = appUser;
    });
    this.helperService.curPage$.subscribe((page: string) => this.currentPage = page);

    /*this.cartService.getCart()
      .then((cart: Cart) => this.cart = cart)      
      .catch((error) =>console.log(error));
      
    this.cartCount = this.cart.cartItemCount;
    console.log(this.cartCount);*/
  }

  onLogout() {
    this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }, {
          text: 'Logout',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    }).present();
    this.navCtrl.popToRoot();
  }

  onShowCart() {
    // this.navCtrl.setRoot('TabsPage', { selectedIndex: 2 });
    this.navCtrl.parent.select(3);
    //if (this.navCtrl.parent.getActiveChildNavs())
    //this.navCtrl.push('ShoppingCartPage');
  }

  onShowAdminOptions() {
    if (this.appUser.isAdmin) {

      this.actionCtrl.create({
        title: 'Admin Controls',
        buttons: [
          {
            text: 'Manage Orders',
            handler: () => {
              this.navCtrl.push('AdminOrdersPage');
            }
          }, {
            text: 'Manage Products',
            handler: () => {
             this.navCtrl.push('AdminProductsPage');
            }
          }, {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      }).present();

    } else {
      return;
    }
    
  }

  onAnonClick() {
    let msg: string = 'You are not logged in/not admin';
    this.toastHandler(msg);
  }

  private toastHandler(msg: string) {
    this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 1500
    }).present();
  }
}
