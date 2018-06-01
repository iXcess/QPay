import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { PromotionPage } from '../pages/promotion/promotion';
import { PaymentPage } from '../pages/payment/payment';
import { SuccessPage } from '../pages/success/success';
import { AdvertisementPage } from '../pages/advertisement/advertisement';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { PortfolioPage } from '../pages/portfolio/portfolio';
import { DepositPage } from '../pages/deposit/deposit';
import { HistoryPage } from '../pages/history/history';
import { SettingsPage } from '../pages/settings/settings';
import { SplitbillPage } from '../pages/splitbill/splitbill';
import { SplitbillfinalPage } from '../pages/splitbillfinal/splitbillfinal';
import { ContactsPage } from '../pages/contacts/contacts';

import { StatusBar } from '@ionic-native/status-bar';
import { ProgressBar } from 'progressbar.js';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { DataProvider } from '../providers/data/data';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Contacts, ContactFieldType, IContactFindOptions } from '@ionic-native/contacts';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PromotionPage,
    PaymentPage,
    SuccessPage,
    AdvertisementPage,
    TutorialPage,
    WelcomePage,
    PortfolioPage,
    DepositPage,
    HistoryPage,
    SettingsPage,
    SplitbillPage,
    SplitbillfinalPage,
    ContactsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PromotionPage,
    PaymentPage,
    SuccessPage,
    AdvertisementPage,
    TutorialPage,
    WelcomePage,
    PortfolioPage,
    DepositPage,
    HistoryPage,
    SettingsPage,
    SplitbillPage,
    SplitbillfinalPage,
    ContactsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    BarcodeScanner,
    Contacts
  ]
})
export class AppModule {}
