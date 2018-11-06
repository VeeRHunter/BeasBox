import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomBoxPage } from './custom-box';

@NgModule({
  declarations: [
    CustomBoxPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomBoxPage),
  ],
})
export class CustomBoxPageModule {}
