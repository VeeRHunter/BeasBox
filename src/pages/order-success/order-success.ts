import { Component, OnInit }   from '@angular/core';

import { IonicPage, 
         NavController, 
         NavParams }   from 'ionic-angular';

import { UserAuthService } from '../../app/shared/services/user-auth.service';         
import { AppUser }     from '../../app/shared/models/app-user.model';


@IonicPage()
@Component({
  selector: 'page-order-success',
  templateUrl: 'order-success.html',
})
export class OrderSuccessPage {

  appUser: AppUser;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private authService: UserAuthService) {
  }

  ionViewWillEnter() {
    this.authService.appUser$.subscribe((user) => {
      if (!user) return;
      this.appUser = user;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderSuccessPage');
  }

}
