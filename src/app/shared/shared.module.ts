import { NgModule }                  from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { HttpModule }                from '@angular/http';
import { HttpClientModule }          from '@angular/common/http';
import { IonicModule }               from 'ionic-angular';
import { AngularFireAuthModule }     from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule }    from 'angularfire2/firestore';

import { TruncatePipe }              from '../shared/pipes/truncate.pipe';

import { CartItemComponent }         from './components/cart-item/cart-item.component';
import { ProductCardComponent }      from './components/product-card/product-card.component';
import { ProductListComponent }      from './components/product-list/product-list.component';
import { ProductGridComponent }      from './components/product-grid/product-grid.component';
import { ProductFilterComponent }    from './components/product-filter/product-filter.component';
// import { DataService }               from './services/data.service';
// import { HelperService }             from './services/helper.service';
// import { UserAuthService }           from './services/user-auth.service';
// import { ShoppingCartService }       from './services/shopping-cart.service';
// import { WooCommerceService }        from './services/woocommerce.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        IonicModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        //AngularFirestoreModule.enablePersistence()
    ],
    declarations: [
        TruncatePipe,
        CartItemComponent,
        ProductCardComponent,
        ProductListComponent,
        ProductGridComponent,
        ProductFilterComponent
    ],
    providers: [
        // DataService,
        // HelperService,
        // ShoppingCartService,
        // UserAuthService,
        // WooCommerceService
    ],
    exports: [
        CommonModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        IonicModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFirestoreModule,
        CartItemComponent,
        ProductCardComponent,
        ProductListComponent,
        ProductGridComponent,
        ProductFilterComponent
    ],
})
export class SharedModule {}