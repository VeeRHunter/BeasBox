import { NgModule } from '@angular/core';

import { IonicPageModule } from 'ionic-angular';
import { CoreModule } from '../../../app/core/core.module';

import { AdminOrdersPage } from './admin-orders';


@NgModule({
    declarations: [
        AdminOrdersPage
    ],
    imports: [
        CoreModule,
        IonicPageModule.forChild(AdminOrdersPage)
    ],
    exports: [
        AdminOrdersPage
    ]
})
export class AdminOrdersModule{}