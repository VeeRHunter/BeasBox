import { Component, 
        OnInit, 
        ViewChild } from '@angular/core';
import { IonicPage, 
         Navbar, 
         NavController, 
         NavParams } from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'page-admin-products',
    templateUrl: './admin-products.html'
})
export class AdminProductsPage {

    @ViewChild('navbar') navbar: Navbar;

    constructor(private navCtrl: NavController, private navParams: NavParams) {
        
    }

    ionViewWillEnter() {
    }
}