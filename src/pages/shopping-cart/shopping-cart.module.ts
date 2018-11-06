import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CoreModule } from '../../app/core/core.module';
import { SharedModule } from '../../app/shared/shared.module';
import { ShoppingCartPage } from './shopping-cart';

@NgModule({
  declarations: [
    ShoppingCartPage,
  ],
  imports: [
    CoreModule,
    SharedModule,
    IonicPageModule.forChild(ShoppingCartPage),
  ],
  exports: [
    ShoppingCartPage,
  ]
})
export class ShoppingCartPageModule {}
