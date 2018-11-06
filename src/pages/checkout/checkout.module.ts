import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreModule } from '../../app/core/core.module';
import { CheckoutPage } from './checkout';

@NgModule({
  declarations: [
    CheckoutPage,
  ],
  imports: [
    CoreModule,
    IonicPageModule.forChild(CheckoutPage),
  ],
})
export class CheckoutPageModule {}
