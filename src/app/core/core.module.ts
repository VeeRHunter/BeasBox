import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';

import { NavbarComponent }        from './components/navbar/navbar.component';
import { SearchToolbarComponent } from './components/search-toolbar/search-toolbar.component';
import { NewProductComponent } from './components/new-product/new-product.component';

@NgModule({
    declarations: [
        NavbarComponent,
        SearchToolbarComponent,
        NewProductComponent,
    ],
    imports: [
        IonicModule,
        CommonModule,
        SharedModule
    ],
    providers: [],
    exports: [
        NavbarComponent,
        SearchToolbarComponent,
        NewProductComponent
    ]
})
export class CoreModule {}