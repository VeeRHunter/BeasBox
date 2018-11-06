import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BundleItemsPage } from './bundle-items';

@NgModule({
  declarations: [
    BundleItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(BundleItemsPage),
  ],
})
export class BundleItemsPageModule {}
