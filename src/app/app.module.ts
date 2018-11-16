import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorHandler,
  NgModule, //isDevMode
} from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { environment } from '../environments/environment';


//import { NgRedux, NgReduxModule, DevToolsExtension } from 'ng2-redux';
//import { rootReducer, INITIAL_STATE, IAppState } from './store';
//import { fromJS, Map } from 'immutable';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { PayPal } from '@ionic-native/paypal';
// import { NativeStorage } from '@ionic-native/native-storage';
import { MyApp } from './app.component';

import { DataService } from './shared/services/data.service';
import { HelperService } from './shared/services/helper.service';
import { UserAuthService } from './shared/services/user-auth.service';
import { UPSService } from './shared/services/ups.service';
import { ShoppingCartService } from './shared/services/shopping-cart.service';
import { WooCommerceService } from './shared/services/woocommerce.service';
import { DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    //NgReduxModule,
    CoreModule,
    SharedModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PayPal,
    // NativeStorage,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataService,
    HelperService,
    ShoppingCartService,
    UserAuthService,
    UPSService,
    WooCommerceService,
    DecimalPipe
  ]
})
export class AppModule {
  /*constructor(ngRedux: NgRedux<IAppState>,
              devTools: DevToolsExtension) {

    const enhancers: any[] = isDevMode() ? [devTools.enhancer()] : [];

    ngRedux.configureStore(rootReducer, fromJS(INITIAL_STATE), [], enhancers);
  }*/
}
