import { NgModule } from '@angular/core';
import { CoreModule } from '../../app/core/core.module';
import { SharedModule } from '../../app/shared/shared.module';

import { IonicPageModule } from 'ionic-angular';

import { PreProductsPage } from './pre-products';


@NgModule({
  declarations: [
    PreProductsPage
  ],
  imports: [
    CoreModule,
    SharedModule,
    IonicPageModule.forChild(PreProductsPage)
  ],
  exports: [
    PreProductsPage
  ]
})
export class PreProductsPageModule {}
