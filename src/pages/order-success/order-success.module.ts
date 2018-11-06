import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreModule } from '../../app/core/core.module';
import { OrderSuccessPage } from './order-success';

@NgModule({
  declarations: [
    OrderSuccessPage,
  ],
  imports: [
    CoreModule,
    IonicPageModule.forChild(OrderSuccessPage),
  ],
})
export class OrderSuccessPageModule {}
