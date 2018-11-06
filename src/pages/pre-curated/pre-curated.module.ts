import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PreCuratedPage } from './pre-curated';

@NgModule({
  declarations: [
    PreCuratedPage,
  ],
  imports: [
    IonicPageModule.forChild(PreCuratedPage),
  ],
})
export class PreCuratedPageModule {}
