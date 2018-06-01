import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContactsPage } from '../contacts/contacts';
import { PaymentPage } from '../payment/payment';
import { HistoryPage } from '../history/history';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {
  amount = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.amount = this.navParams.get('amount');
  }

  splitBill(params){
    if (!params) params = {};
    this.navCtrl.push(ContactsPage, {total: this.amount});
  }

  returnHome() {
    this.navCtrl.setRoot(HomePage);
  }

}
