import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SplitbillPage } from '../splitbill/splitbill';

@IonicPage()
@Component({
  selector: 'page-splitbillfinal',
  templateUrl: 'splitbillfinal.html',
})
export class SplitbillfinalPage {
  contact: any;
  splitValues = [];
  total: number;
  equal: number;


  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.contact = this.navParams.get('contact');
    this.total = Number(this.navParams.get('amount'));

    this.equal = Number((this.total / this.contact.length).toFixed(2));
  }

  submit() {
    let sum = this.splitValues.reduce((a, b) => Number(a) + Number(b), 0);

    if (sum > this.total) {
      let alert = this.alertCtrl.create({
        title: "Failed",
        subTitle: "The total amount has exceeded the total.",
        buttons: ['Dismiss']
      });
      alert.present();
    }
    
  }

}
