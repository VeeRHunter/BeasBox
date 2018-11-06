import { Component, ViewChild } from '@angular/core';

import { IonicPage, ViewController, NavController, AlertController, NavParams, Button, Slides }               from 'ionic-angular';
import { Billing }  from './../../app/shared/models/billing.model';
import { states } from '../../app/shared/models/states.model';
//import { Question, SurveyOpt }  from '../../models/question.model';
//import { Setting }              from '../../models/user.model';
import { Storage } from '@ionic/storage';
import { AppUser } from '../../app/shared/models/app-user.model';
import { UserAuthService } from '../../app/shared/services/user-auth.service';
import { DataService } from '../../app/shared/services/data.service';


@IonicPage()
@Component({
  selector: 'page-quiz',
  templateUrl: 'quiz.html',
})
export class QuizPage {
  user: firebase.User;
  appUser: AppUser;
  stateList = states;
  
  @ViewChild('quiz') quiz: Slides;
  @ViewChild('prevSlide') prevSlide: Button;
  @ViewChild('nextSlide') nextSlide: Button;
  curSlide: number;  
  curLength: number;  
  isLastSlide: boolean = false;
  isFirstSlide: boolean = true;

  genderOpts: string[] = [
    'female',
    'male',
    'other'
  ];
  statusOpts: string[] = [
    'single',
    'married',
    'relationship'
  ];

  myGender: string = 'female';
  myStatus: string = 'single';
  myRelationAnniversary: string = null;
  myBillingAddress: Billing = {
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "United States(US)",
    email: "",
    phone: "",
  };
  // myBirthday: string; unused
  myPartnerBirthday: string = null;
  myPartnerAnniversary: string = null;
  mySpecialDays: Array<{type: string, day:string, name: string}> = [{type: null, day:null, name: null}];
  myAdditional: string = '';

  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController,
              public alertCtrl: AlertController,
              public storage: Storage,
              private authService: UserAuthService,
              private dataService: DataService,
              public navParams: NavParams) {
  }

  ionViewWillEnter() {
    this.authService.getAuthenticatedUser().subscribe((user: firebase.User) => this.user = user);
    this.authService.appUser$.subscribe((user) => this.appUser = user);
    this.curSlide = this.quiz.getActiveIndex();
    this.curLength = this.quiz.length();
  }

  setGender(index) {
    this.myGender = this.genderOpts[index];
    this.onNextSlide();
  }

  setStatus(index) {
    this.myStatus = this.statusOpts[index];
  }
    // console.log(this.regSpecialDays);
    // let days = [];
    // this.regSpecialDays.forEach(day => {
    //     if(day) {
    //         // let mm = day.getMonth() + 1; // getMonth() is zero-based
    //         // let dd = day.getDate();
    //         // let strDay = [day.getFullYear(), (mm>9 ? '' : '0') + mm, (dd>9 ? '' : '0') + dd].join('');
    //         days.push(day);
    //     }
    // });
  AddDay() {
    this.mySpecialDays.push({type: null, day:null, name: null});
  }

  CancelDay() {
    this.mySpecialDays.pop();
  }

  onPrevSlide() {
    
    setTimeout(() =>{
      if (!this.isFirstSlide) {
        this.quiz.slidePrev();
        this.isFirstSlide = this.quiz.isBeginning();
        this.isLastSlide = this.quiz.isEnd();
        this.curSlide = this.quiz.getActiveIndex();
        this.curLength = this.quiz.length();
      }
    }, 300);
  }
  
  onNextSlide() {
    setTimeout(()=> {
      this.quiz.slideNext();
      this.isFirstSlide = this.quiz.isBeginning();
      this.isLastSlide = this.quiz.isEnd();
      this.curSlide = this.quiz.getActiveIndex();
      this.curLength = this.quiz.length();
    }, 300);
  }

  slideChanged() {
    this.curSlide = this.quiz.getActiveIndex();
    this.curLength = this.quiz.length();
  }

  checkInvalidate() {
    return this.myBillingAddress.first_name == '' || this.myBillingAddress.last_name == ''
  }

  async saveMyProfile() {
    if(this.checkInvalidate()) {
      this.alertCtrl.create({
        subTitle: 'Please input FIRST NAME and LAST NAME.',
        buttons: [
          {
            text: 'OK'
          }
        ]
      }).present();
      return;
    }
    this.myBillingAddress.email = this.appUser.email;
    let data: AppUser = {
      id: this.appUser.id,
      email: this.appUser.email,
      name: this.appUser.name,
      gender: this.myGender,
      status: this.myStatus,
      relationAnniversary: this.myRelationAnniversary,
      billingAddress: this.myBillingAddress,
      partnerBirthday: this.myPartnerBirthday,
      specialDays: this.mySpecialDays,
      partnerAnniversary: this.myPartnerAnniversary,
      additional: this.myAdditional
    };
    console.log(data);
    await this.dataService.saveAppUser(this.user, data);
    await this.storage.set("user", data);
    this.navCtrl.setRoot('MenuPage');
  }
}
