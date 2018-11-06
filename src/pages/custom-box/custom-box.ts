import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CustomBoxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-custom-box',
  templateUrl: 'custom-box.html',
})
export class CustomBoxPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomBoxPage');
  }
  goBack() {
    this.navCtrl.setRoot("HomePage");
  }

  onShowCart() {
    this.navCtrl.push("ShoppingCartPage");
  }

  submit() {
    
  }
}
