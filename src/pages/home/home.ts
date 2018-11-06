import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController }   from 'ionic-angular';

import { UserAuthService }       from '../../app/shared/services/user-auth.service';
import { HelperService }     from '../../app/shared/services/helper.service';
import { AppUser }           from '../../app/shared/models/app-user.model';
//import { Setting }           from '../../models/user.model';
import { Storage } from '@ionic/storage';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { useAnimation } from '../../../node_modules/@angular/animations';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  appUser: AppUser;
  usernameObservable: Observable<string>;
  newSettings;

  cartPage: string = 'ShoppingCartPage';
  ordersPage: string = 'MyOrdersPage';

  constructor(
    public storage: Storage,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private authService: UserAuthService,
    public helperService: HelperService) {
      
  }

  ionViewWillEnter() {
    this.authService.appUser$.subscribe((user) => {
      console.log(user)
      this.appUser = user
    });
    this.usernameObservable = this.authService.appUser$.map(user => {
      if(!user) return '';
      return user.billingAddress.first_name
    });
  }

  onShowQuizPage() {
    let quizModal = this.modalCtrl.create('QuizPage')
    quizModal.onDidDismiss((data) => {
      this.newSettings = data;

      console.log(this.newSettings);
    });
    
    quizModal.present();
    //this.curUser$.userSettings = this.newSettings;
  }

  async navPreCurated() {
    // this.navCtrl.push('PreCuratedPage');
    await this.storage.set('selected_category', 'Precurated');
    await this.storage.set('selected_subcategory', "All");
    this.navCtrl.push("PreProductsPage");
  }

  async navBundleItems() {
    // this.navCtrl.push('BundleItemsPage');
    await this.storage.set('selected_category', 'BeesBundle');
    await this.storage.set('selected_subcategory', "All");
    this.navCtrl.push("BundleProductsPage");
  }

  navCustomBox() {
      this.navCtrl.push("CustomBoxPage");
  }

  onShowCart() {
    this.navCtrl.push("ShoppingCartPage");
  }
}
