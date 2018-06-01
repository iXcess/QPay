import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Slides } from 'ionic-angular';
import { ViewChild } from '@angular/core';

import { SuccessPage } from '../success/success';
import { PromotionPage } from '../promotion/promotion';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { DataProvider } from '../../providers/data/data';
import { Http, Headers } from "@angular/http";


@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  @ViewChild(Slides) slides: Slides;

  options: BarcodeScannerOptions;
  createdCode = null;
  scannedCode = null;
  selfAmount = null;
  roundUps = ["RM 1","RM 10","RM 100"];
  roundValue = 0;

  constructor(private barcode: BarcodeScanner, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,private _data: DataProvider, public http: Http) {
  }

  presentConfirm(amount,index) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Payment',
      subTitle: 'Amount: RM' + amount.toFixed(2) + '<br/>Rounding to the nearest ' + this.roundUps[index] + "<br/>To be paid: RM" + this.roundUp(amount,index),
      message: "Do you want to proceed?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.roundValue = this.roundUp(amount,index) * 100;
            this.payment(JSON.parse(this.scannedCode));
            this.navCtrl.push(SuccessPage, {status: true, amount: Number(amount)});
          }
        }
      ]
    });
    alert.present();
  }

  presentInvalid(title,subTitle) {
  let alert = this.alertCtrl.create({
    title: title,
    subTitle: subTitle,
    buttons: ['Dismiss']
  });
  alert.present();
}

  
  /*isValid(message) {
    if (message.substr(0,7) === "waituck") {
      return true;
    }
    else {
      return false;
    }
  }*/

  roundUp(amount,index) {
    amount = Number(amount);
    let multiFactor = Math.pow(10,index);
    let payment = Math.ceil(amount/multiFactor)*multiFactor;
    let change = payment - amount;

    return payment;
  }

  async scanCode(index){
    const results = await this.barcode.scan();

    // ScannedCode eg. {"merchant_id":4, "value":2000}
    this.scannedCode = results.text;

    //if (this.isValid(this.scannedCode)) {
    this.presentConfirm(Number(JSON.parse(this.scannedCode).value)/100,index);
    //} else {
      //this.presentInvalid("QR Invalid","Please scan the appropriate code.");
    //}
  }

  ionViewDidLoad() {
    //this.payment(JSON.parse('{"id": 11, "merchant_id": 1, "value":190}'));
  }

  payment(scannedCode) {
    let id = scannedCode.id;
    let authHeader = "";
    let url = this._data.API + 'sales/' + id;

    let body = {
      user_id: localStorage.userId,
      value_roundup: ((this.roundValue - scannedCode.value))
    }

    // token and userId is saved in localstorage when user login
    if (localStorage.token && localStorage.userId) {
      authHeader = btoa(localStorage.userId + ":" + localStorage.token);

    } else {
      // FOR DEV ONLY  to be remove for production 
      authHeader = btoa('1:349867d9f10502ccbbee2f24e5da1979859183304c5f36cabd901168c770db05');
      url += '1&startstamppaid=2018-02-09T08:00:00Z&endstamppaid=2018-03-09T07:59:59Z';
    }

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append("Authorization", "Basic " + authHeader);
    
    console.log(this.roundValue)
    console.log(url);
    console.log(body);
    this.http.put(url, JSON.stringify(body) ,{headers: headers})
    .map(res => res.json())
    .subscribe((data) => {
      console.log(data);
    } , err => {
      console.log(err);
    });

  }

}
