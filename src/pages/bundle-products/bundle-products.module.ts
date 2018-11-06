import { NgModule } from '@angular/core';
import { CoreModule } from '../../app/core/core.module';
import { SharedModule } from '../../app/shared/shared.module';

import { IonicPageModule } from 'ionic-angular';

import { BundleProductsPage } from './bundle-products';


@NgModule({
  declarations: [
    BundleProductsPage
  ],
  imports: [
    CoreModule,
    SharedModule,
    IonicPageModule.forChild(BundleProductsPage)
  ],
  exports: [
    BundleProductsPage
  ]
})
export class BundleProductsPageModule {}
