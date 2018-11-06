import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreModule } from '../../app/core/core.module';
import { QuizPage } from './quiz';

@NgModule({
  declarations: [
    QuizPage,
  ],
  imports: [
    CoreModule,
    IonicPageModule.forChild(QuizPage),
  ],
  exports: [
    QuizPage
  ]
})
export class QuizPageModule {}
