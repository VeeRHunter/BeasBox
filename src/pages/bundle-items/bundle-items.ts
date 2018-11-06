  import { Component, OnInit } from '@angular/core';
  import { IonicPage, NavController, NavParams, ModalController }   from 'ionic-angular';
  
  import { UserAuthService }       from '../../app/shared/services/user-auth.service';
  import { HelperService }     from '../../app/shared/services/helper.service';
  import { WooCommerceService }       from '../../app/shared/services/woocommerce.service';
  import { AppUser }           from '../../app/shared/models/app-user.model';
  //import { Setting }           from '../../models/user.model';
  import { Storage } from '@ionic/storage';
  
  @IonicPage()
  @Component({
    selector: 'page-bundle-items',
    templateUrl: 'bundle-items.html',
  })
  export class BundleItemsPage{
  
    appUser: AppUser;
    newSettings;
  
    cartPage: string = 'ShoppingCartPage';
    ordersPage: string = 'MyOrdersPage';
  
    constructor(
      public storage: Storage,
      public navCtrl: NavController, 
      public navParams: NavParams,
      public modalCtrl: ModalController,
      private authService: UserAuthService,
      private wooService: WooCommerceService,
      public helperService: HelperService) {
    }
  
    ionViewWillEnter() {
        this.authService.appUser$.subscribe((user) => this.appUser = user);
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


    async getSubCateProducts(selected_subcategory) {
        await this.storage.set('selected_category', 'BeesBundle');
        await this.storage.set('selected_subcategory', selected_subcategory);
        // this.navCtrl.parent.select(1);
        this.navCtrl.push("BundleProductsPage");
    }

    goBack() {
      this.navCtrl.setRoot("HomePage");
    }

    onShowCart() {
      this.navCtrl.push("ShoppingCartPage");
    }
  }
  
  