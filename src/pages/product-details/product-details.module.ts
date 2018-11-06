import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CoreModule } from '../../app/core/core.module';
import { ProductDetailsPage } from './product-details';


@NgModule({
  declarations: [
    ProductDetailsPage,
  ],
  imports: [
    CoreModule,
    IonicPageModule.forChild(ProductDetailsPage),
  ],
  exports: [
    ProductDetailsPage
  ]
})
export class ProductDetailsPageModule {}
