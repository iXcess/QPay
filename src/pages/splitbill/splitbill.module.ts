import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SplitbillPage } from './splitbill';

@NgModule({
  declarations: [
    SplitbillPage,
  ],
  imports: [
    IonicPageModule.forChild(SplitbillPage),
  ],
})
export class SplitbillPageModule {}
