import { Component, OnInit } from '@angular/core';

import { IonicPage,       NavController, 
         NavParams }         from 'ionic-angular';

import { UserAuthService }       from '../../app/shared/services/user-auth.service';
import { HelperService }     from '../../app/shared/services/helper.service';
import { AppUser }           from '../../app/shared/models/app-user.model';
import { DataService } from '../../app/shared/services/data.service';
import { Observable } from '../../../node_modules/rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html',
})
export class MyOrdersPage  {
  user: firebase.User
  appUser: AppUser;
  usernameObservable: Observable<string>;
  orderList: string[] = [
    'order 1',
    'order 2'
  ];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public dataService: DataService,
    public authService: UserAuthService,
    public helperService: HelperService) {
  }

  ionViewWillEnter() {
    let self = this
    this.authService.getAuthenticatedUser().subscribe((user: firebase.User) => {
      self.user = user
      self.dataService.getOrders(self.user).once('value', snapshot => {
          let orderList = snapshot.val()
          let keyList = Object.keys(snapshot.val())
          self.orderList = []
          for (let key of keyList) { 
            self.orderList.push(orderList[key]);
          }
      });
    });
    this.authService.appUser$.subscribe((user) => {
      if (!user) return;
      self.appUser = user;
    });
    this.usernameObservable = this.authService.appUser$.map(user => {
      if(!user) return '';
      return user.billingAddress.first_name + " " + user.billingAddress.last_name
    });
  }
  
  goBack() {
    console.log(this.orderList);
    this.navCtrl.setRoot("HomePage");
  }
}
