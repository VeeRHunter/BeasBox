import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreModule } from '../../app/core/core.module';
import { MyOrdersPage } from './my-orders';

@NgModule({
  declarations: [
    MyOrdersPage,
  ],
  imports: [
    CoreModule,
    IonicPageModule.forChild(MyOrdersPage),
  ],
  exports: [
    MyOrdersPage
  ]
})
export class MyOrdersPageModule {}
