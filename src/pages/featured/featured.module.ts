import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreModule } from '../../app/core/core.module';
import { FeaturedPage } from './featured';

@NgModule({
  declarations: [
    FeaturedPage,
  ],
  imports: [
    CoreModule,
    IonicPageModule.forChild(FeaturedPage),
  ],
  exports: [
    FeaturedPage
  ]
})
export class FeaturedPageModule {}
