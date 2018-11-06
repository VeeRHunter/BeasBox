import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../app/shared/services/data.service';
import { UserAuthService } from '../../app/shared/services/user-auth.service';

import { AppUser } from '../../app/shared/models/app-user.model';
import { Billing } from '../../app/shared/models/billing.model';
import { states } from '../../app/shared/models/states.model';

import { Storage } from '@ionic/storage';
import { Observable } from '../../../node_modules/rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: firebase.User;
  appUser: AppUser;
  stateList = states;
  usernameObservable: Observable<string>;
  mode = "view";

  billingAddress: Billing = {
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    email: "",
    phone: "",
  };

  editUser: AppUser = {
    id: null,
    email: null,
    name: null,
    gender: "",
    status: "",
    relationAnniversary: "",
    billingAddress: this.billingAddress,
    // myBirthday: "", unused
    partnerBirthday: "",
    partnerAnniversary: "",
    specialDays: [{type: null, day:null, name: null}],
    additional: ""
  }

  newSpecialType: string = null;
  newSpecialName: string = null;
  newSpecialDay: string = null;

  constructor(
      private dataService: DataService,
      private authService: UserAuthService,
      public storage: Storage,
      public navCtrl: NavController, 
      public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.authService.getAuthenticatedUser().subscribe((user: firebase.User) => this.user = user);
    this.authService.appUser$.subscribe((user) => { 
        this.appUser = user;
        if(!user) return;
        this.editUser = {
          id: this.appUser.id,
          email: this.appUser.email,
          name: this.appUser.name,
          gender: "" || this.appUser.gender,
          status: "" || this.appUser.status,
          relationAnniversary: null || this.appUser.relationAnniversary,
          partnerBirthday: null || this.appUser.partnerBirthday,
          partnerAnniversary: null || this.appUser.partnerAnniversary,
          specialDays: [{type: null, day:null, name: null}] || this.appUser.specialDays ,
          additional: "" || this.appUser.additional
        }
        if(!this.appUser.billingAddress)  this.editUser.billingAddress = this.billingAddress;
        else  this.editUser.billingAddress = this.appUser.billingAddress;
        console.log(user); 
    });

    this.usernameObservable = this.authService.appUser$.map(user => {
      if(!user) return '';
      return user.billingAddress.first_name + " " + user.billingAddress.last_name
    });
  }

  goBack() {
    this.navCtrl.setRoot("HomePage");
  }

  onShowCart() {
    this.navCtrl.push("ShoppingCartPage");
  }

  editProfile() {
    this.mode = "edit";
  }
  async saveProfile() {
    this.appUser = this.editUser;
    await this.dataService.saveAppUser(this.user, this.editUser);
    await this.storage.set("user", this.appUser);
    this.mode = "view";
  }
  AddDay() {
    if(this.newSpecialType == null || this.newSpecialDay == null || this.newSpecialName == null) {
       return;
    }
    this.editUser.specialDays.push({type: this.newSpecialType, day:this.newSpecialDay, name: this.newSpecialName});
    this.newSpecialType = null;
    this.newSpecialDay = null;
    this.newSpecialName = null;
  }

  CancelDay() {
    this.editUser.specialDays.pop();
  }
}
