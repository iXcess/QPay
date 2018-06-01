import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { PaymentPage } from '../payment/payment';
import { SuccessPage } from '../success/success';
import { AdvertisementPage } from '../advertisement/advertisement';
// import { InvestmentPage } from '../investment/investment';

@IonicPage()
@Component({
  selector: 'page-promotion',
  templateUrl: 'promotion.html',
})
export class PromotionPage {
  adList: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    if (!localStorage.adList) {
      this.adList = [
        [
          { 
            id: 1, 
            category: "Grocery",
            merchant: "GIANT",
            logoimg: "ads/g0.png",
            title: "Spring Sales",
            img: "ads/g1.png",
            discountValue: "RM 10",
            discountType: "fixed",
            description: "Shop with Giant Malaysia using Q-Invest app, and they’ll invest RM 10 into your Q-Invest account for every purchase of more than RM 150 in a single receipt.",
            clicks: 0,
          }, 
          {  
            id: 1,
            category: "Grocery",
            merchant: "TESCO",
            logoimg: "tesco_logo.jpg",
            title: "Summer Sales",
            img: "ads/te1.png",
            discountValue: "RM 20",
            discountType: "fixed",
            description: "Pay using Q-Invest App to redeem RM 20 worth investment contribution for every purchase more than RM 200 in a single receipt ",
            clicks: 0,
          }
        ],
        [
          {  
            id: 2,
            category: "Food",
            merchant: "MyBurgerLab",
            logoimg: "ads/mb0.png",
            title: "Dinner Promotion",
            img: "ads/mb1.png",
            discountValue: "RM 10",
            discountType: "fixed",
            description: "Get RM 10 rebate while enjoying myBurgerlab awesomeness of a Burger set at only RM 25 (single patty, with a Side Dish and Soda) only via the Q-Invest app",
            clicks: 0,
          }, 
          {  
            id: 2,
            category: "Food",
            merchant: "McDonald's",
            logoimg: "ads/mc0.png",
            title: "Breakfast Promotion",
            img: "ads/mc1.png",
            discountValue: "RM 5",
            discountType: "fixed",
            description: "Have your breakfast using Q-Invest app, and they’ll invest RM 5 of your purchase price into your Q-Invest account for every purchase of more than RM 50 in a single receipt.",
            clicks: 0,
          }
        ],
        [
          {  
            id: 8,
            category: "Food",
            merchant: "TheFishBowl",
            logoimg: "ads/t0.png",
            title: "Lunch Promotion",
            img: "ads/t1.png",
            discountValue: "RM 5",
            discountType: "fixed",
            description: "Pay using Q-Invest App to redeem RM 5 rebate in the form of investment contribution to your Q-Invest portfolio on every 13th. ",
            clicks: 0,
          }, 
          {
            id: 3,
            category: "Tech",
            merchant: "HUAWEI",
            logoimg: "ads/h0.png",
            title: "CNY Promotion",
            img: "ads/h1.png",
            discountValue: "5%",
            discountType: "percent",
            description: "Purchase Huawei Nova 2i  using Q-Invest app, and they’ll invest 5% of your purchase price into your Q-Invest account. Reward is one-time off for every user.",
            clicks: 0,
          }
        ],
        [
          {
            id: 4,
            category: "Fashion",
            merchant: "ISETAN",
            logoimg: "isetan_logo.png",
            title: "100th Anniversary Promotion",
            img: "promotion_banner.jpg",
            discountValue: "RM 10",
            discountType: "fixed",
            description: "Shop with Isetan using Q-Invest app, and they’ll invest RM 10 into your Q-invest account for every purchase of more than RM 100 in a single receipt.",
            clicks: 0,
          }, 
          {
            id: 4,
            category: "Fashion",
            merchant: "PADINI",
            logoimg: "ads/p0.png",
            title: "Christmas Promotion",
            img: "ads/p1.png",
            discountValue: "5%",
            discountType: "percent",
            description: "Shop with Padini using Q-Invest app, and they’ll invest 5% of your purchase price into your Q-Invest account for every purchase of more than RM 100 in a single receipt.",
            clicks: 0,
          }
        ]
      ];
      localStorage.adList = JSON.stringify(this.adList);
    } else {
      //console.log(localStorage.adList);
      this.adList = JSON.parse(localStorage.adList);
    }
    

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromotionPage');
  }
  goToAdvertisement(id, merchant){
    //if (!params) params = {};
    localStorage.selectedMerchantAds = merchant;

    this.adList = JSON.parse(localStorage.adList);

    for (let i = 0; i < this.adList.length; i++) {
      if (this.adList[i][0].id == id) {
        this.adList[i][0].clicks++;
      }  
    }

    for (let j = 0; j < this.adList.length - 1; j++) {
      for (let i = 0; i < this.adList.length - 1; i++) {
        if (this.adList[i][0].clicks < this.adList[i + 1][0].clicks) {
          let tmp = this.adList[i];
          this.adList[i] = this.adList[i + 1];
          this.adList[i + 1] = tmp;
        }
      }
    }
    localStorage.adList = JSON.stringify(this.adList);
    this.navCtrl.push(AdvertisementPage);
  }
  goToSuccess(params){
    if (!params) params = {};
    this.navCtrl.push(SuccessPage);
  }

  trackByFn(index, item) {
    return item[0].id;
  }
  //goToInvestment(params){
  //   if (!params) params = {};
  //   this.navCtrl.push(InvestmentPage);
  // }

  

}
