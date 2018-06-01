import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { SignupPage } from '../pages/signup/signup';
import { PromotionPage }  from '../pages/promotion/promotion';
import { SuccessPage } from '../pages/success/success';
import { PaymentPage } from '../pages/payment/payment';
import { AdvertisementPage } from '../pages/advertisement/advertisement';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { PortfolioPage } from '../pages/portfolio/portfolio';
import { DepositPage } from '../pages/deposit/deposit';
import { HistoryPage } from '../pages/history/history';
import { SettingsPage } from '../pages/settings/settings';  
import { SplitbillPage } from '../pages/splitbill/splitbill';
import { SplitbillfinalPage } from '../pages/splitbillfinal/splitbillfinal';
import { ContactsPage } from '../pages/contacts/contacts';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = WelcomePage;

  pages: Array<{title: string, icon: string, component: any}>;
  alert: any = null;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private alertCtrl: AlertController) {
    this.initializeApp();
    let alert;
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'HOME', icon: 'home', component: HomePage },
      { title: 'DEPOSIT/WITHDRAWAL', icon: 'repeat', component: DepositPage },
      { title: 'QR PAYMENT', icon: 'logo-usd', component: PaymentPage },
      { title: 'SPLIT BILLS', icon: 'resize', component: SplitbillPage },
      { title: 'TRANSACTION', icon: 'swap', component: HistoryPage },
      { title: 'PORTFOLIO', icon: 'trending-up', component: PortfolioPage },
      { title: 'SALES/PROMOTION', icon: 'heart', component: PromotionPage },
      { title: 'CONTACTS', icon: 'people', component: ContactsPage },
      { title: 'SETTINGS', icon: 'settings', component: SettingsPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.setAndroidBackBtn();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scernario
    this.nav.setRoot(page.component);
  }

  // set hardware back btn behaviour
  setAndroidBackBtn() {
    this.platform.registerBackButtonAction(() => {
      console.log("backPressed");
      //console.log(this.navCtrl.getActive().isOverlay);
      let currentPage = this.nav.getActive().name;

      // exit app at homepage
      if (currentPage === "HomePage") {
        if(this.alert){ 
          this.alert.dismiss();
          this.alert = null;     
        }else{
          this.showAlert();
        }

      // at > 2nd level page, go back to root page   
      } else if (this.nav.canGoBack()) {
        this.nav.pop();

      // at rootpage, go back to homepage
      } else {
        this.nav.setRoot(HomePage);
      }

    },1);  
  }

  showAlert() {
    this.alert = this.alertCtrl.create({
      title: 'Exit?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.alert =null;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    this.alert.present();
  }


}