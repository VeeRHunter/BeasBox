import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import {
  App,
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from 'ionic-angular';

import { UserAuthService } from '../../app/shared/services/user-auth.service';
import { AppUser } from '../../app/shared/models/app-user.model';

import { Observable } from 'rxjs/Observable';
import { LoginResponse } from '../../app/shared/models/login-response.model';

import * as firebase from 'firebase';
import { DataService } from '../../app/shared/services/data.service';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: firebase.User;
  appUser: AppUser;
  status: string = 'signin';
  toggleLabel: string = "Don't have an Account? Register.";
  returnPage: string;

  logEmail: string;
  logPass: string;

  regEmail: string;
  regPass: string;
  regConfirm: string;


  socials: Array<{ name: string, icon: string }> = [
    {
      name: 'google',
      icon: 'logo-google'
    }, {
      name: 'facebook',
      icon: 'logo-facebook'
    }, {
      name: 'twitter',
      icon: 'logo-twitter'
    }
  ];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: UserAuthService,
    private dataService: DataService) {
    this.returnPage = (this.navParams.data) ? this.navParams.data.returnPage : null;
  }

  ionViewWillEnter() {
    this.authService.getAuthenticatedUser()
      .subscribe((user: firebase.User) => this.user = user);
    console.log((this.returnPage) ? this.returnPage : '');
  }

  toggleStatus() {
    if (this.status == 'signin') {
      this.status = 'signup';
      this.toggleLabel = "Already have an Account? Log In.";
    } else {
      this.status = 'signin';
      this.toggleLabel = "Don't have an Account? Register.";
    }
  }

  async login() {
    let loader = this.loadingCtrl.create({ content: 'Logging in' });

    loader.onDidDismiss((response: LoginResponse) => {
      if (!response.error) {
        this.handleToast(`logged in via ${response.result.email}`);
        this.navCtrl.setRoot('MenuPage');
      }
      else this.handleToast(`error ${response.error.message}`);
    });

    loader.present();

    if (this.formIsValid()) {
      let res: LoginResponse = await this.authService.loginEmail(this.logEmail, this.logPass);
      loader.dismiss(res);
    }
  }

  async doLogin(method: string) {

    let loader = this.loadingCtrl.create({ content: 'Logging in' });

    loader.onDidDismiss((response) => {
      if (!response.message) {
        this.dataService.saveAppUser(this.user);
        this.handleToast(`logged in via ${method} as ${response.result.email}`);
        this.navCtrl.setRoot('MenuPage');
      }
      else this.handleToast(`error ${response.error.message}`);
    });

    loader.present();

    const res: LoginResponse = await this.authService.LoginSocial(method);
    loader.dismiss(res);
  }

  async doRegister() {
    let loader = this.loadingCtrl.create({ content: 'Logging in' });

    loader.onDidDismiss((response: LoginResponse) => {
      if (!response.error) {
        this.dataService.saveAppUser(this.user, null);
        this.handleToast(`logged in via ${response.result.email}`);
        this.navCtrl.setRoot('QuizPage');
      }
      else this.handleToast(`error ${response.error.message}`);
    });

    loader.present();

    if (this.formIsValid) {
      const res: LoginResponse = await this.authService.register(this.regEmail, this.regPass);
      loader.dismiss(res);
    }
  }

  private handleToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      position: 'middle',
      duration: 500
    }).present();
  }

  private formIsValid(): boolean {
    if (this.status === 'signup') {
      if (this.regEmail == null || this.regEmail == undefined || this.regEmail == '') return false;

      if (this.regPass == null || this.regPass == undefined || this.regPass == '' || this.regPass.length < 6) return false;

      if (this.regConfirm == null || this.regConfirm == undefined || this.regConfirm == '' || this.regConfirm.length < 6) return false;

      if (this.regPass !== this.regConfirm) return false;

      return true;
    }

    if (this.status === 'signin') {
      if (this.logEmail == null || this.logEmail == undefined || this.logEmail == '') return false;

      if (this.logPass == null || this.logPass == undefined || this.logPass == '' || this.logPass.length < 6) return false;

      return true;
    }
  }
}
