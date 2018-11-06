import { Component, OnInit } from '@angular/core';

import { IonicPage, 
         NavController, 
         NavParams }         from 'ionic-angular';

import { UserAuthService }       from '../../app/shared/services/user-auth.service';
import { HelperService }     from '../../app/shared/services/helper.service';
import { AppUser }           from '../../app/shared/models/app-user.model';


@IonicPage()
@Component({
  selector: 'page-featured',
  templateUrl: 'featured.html',
})
export class FeaturedPage {

  appUser: AppUser;

  sampleFeatures: any[] = [
    {
      headline: 'Sample Feature 1',
      desc: 'sample description of feature',
      img: 'map'
    }, {
      headline: 'Sample Feature 2',
      desc: 'sample description of feature',
      img: 'book'
    }, {
      headline: 'Sample Feature 3',
      desc: 'sample description of feature',
      img: 'home'
    }
  ];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public authService: UserAuthService,
              public helperService: HelperService) {}

  ionViewWillEnter() {
    this.authService.appUser$.subscribe((user) => this.appUser = user);
  }

  ionViewDidLoad() {
    /*let name: string = (this.isAuthenticated) ? this.curUser$.displayName : 'null';
    console.log('ionViewDidLoad FeaturedPage ' + name);
    this.helperService.changePage('featured');*/
  }

}
