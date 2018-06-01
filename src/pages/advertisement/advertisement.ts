import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { PromotionPage } from '../promotion/promotion';
import { PaymentPage } from '../payment/payment';

@IonicPage()
@Component({
  selector: 'page-advertisement',
  templateUrl: 'advertisement.html',
})
export class AdvertisementPage {

  promotionName = "100th Anniversary Promotion";
  promotionAmount = "RM 10";
  promotionDescription = "Shop with Isetan using Q-invest app, and they'll invest RM 10 into your Q-invest account for every purchase of more than RM 100.";

  TNCStr = "Terms & Conditions";

  TNC = "<ol><li>Available in Klang Valley</li><br/><li>Limited to the first 5,000 redemptions, on a first come, first served basis only, from 22nd September to 31st December 2017</li><br/><li>This offer is not valid with other promotion/ discounts/ vouchers/ member privileges</li><br/><li>Isetan of Japan Sdn Bhd and ICJ Department Store (M) Sdn Bhd reserved the right to vary and amend any of the above terms and conditions without prior notice</li></ol>";
  bannerImg = "promotion_banner.jpg";
  logoImg = "isetan_logo.png";
 

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {

     
  }

  ionViewDidEnter() {
    
    let adList = JSON.parse(localStorage.adList);

    for (let i = 0; i < adList.length; i++) {
      for (let j = 0; j < 2; j++) {
        if (adList[i][j].merchant == localStorage.selectedMerchantAds) {
          this.promotionName = adList[i][j].title;
          this.promotionAmount = adList[i][j].discountValue;
          this.promotionDescription = adList[i][j].description;
          this.bannerImg = adList[i][j].img;
          this.logoImg = adList[i][j].logoimg;

        }
      }
    }
    
  }

  presentAlert(title, html) {
    let alert = this.alertCtrl.create({
      title: title,
      message: html,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  goToPayment() {
    this.navCtrl.push(PaymentPage);
  }

  // ionViewDidLoad() {
  //  let img = document.getElementById("promotionImage");
  //  img.src = "http://chicken.com.sg/wp-content/uploads/2017/11/Chicken-rice-banner.png";
  // }

}