import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoreModule } from '../../../app/core/core.module';
import { AdminProductsPage } from './admin-products';


@NgModule({
    declarations:[
        AdminProductsPage
    ],
    imports: [
        CoreModule,
        IonicPageModule.forChild(AdminProductsPage)
    ],
    exports: [
        AdminProductsPage
    ]
})
export class AdminProductsPageModule{}