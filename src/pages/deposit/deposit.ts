import { Component } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';


import { SuccessPage } from '../success/success';
import { PromotionPage } from '../promotion/promotion';
import { HomePage } from '../home/home';
import { DataProvider } from '../../providers/data/data';


@IonicPage()
@Component({
  selector: 'page-deposit',
  templateUrl: 'deposit.html',
})
export class DepositPage {

  amount: number;
  options = ["Recurring Deposit","One-Off"];
  recurringDepositOptions = [true,false,false];
  currentOption: string;
  selectedOptions = [true,false];
  index: number;
  depositOption: number;
  oneOffOptions = [true,false];
  oneOffOption: number;
  counter: number;
  numPadActive = [false, false, false, false, false, false, false, false, false, false, false, false];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private alertCtrl: AlertController, private _data: DataProvider, public http: Http) {
  	this.amount = 0;
  	this.index = 0;
  	this.depositOption = 0;
  	this.oneOffOption = 0;
  	this.counter = 1;
  }

  ionViewDidLoad() {
    this.update();
  }

  prevOption() {

  	if (this.index + 1 < this.selectedOptions.length) {
  		this.selectedOptions[this.index + 1] = true;
  		this.selectedOptions[this.index] = false;
  		this.index++;
  		this.update();
  	} else {
      // go back to the first option, if current at the end of array 
      this.selectedOptions[this.index - 1] = true;
      this.selectedOptions[this.index] = false;
      this.index--;
      this.update();
    }

  }

  nextOption() {

  	if (this.index != 0) {
  		this.selectedOptions[this.index - 1] = true;
  		this.selectedOptions[this.index] = false;
  		this.index--;
  		this.update();
  	} else {
      // go to the last option, if current at the start of array
      this.selectedOptions[this.index + 1] = true;
      this.selectedOptions[this.index] = false;
      this.index++;
      this.update();
    }

  }

  update() {
  	this.currentOption = this.options[this.index];
  }

  updateDepositOption(number) {
  	this.depositOption = number;
  	this.recurringDepositOptions = [false,false,false];
  	this.recurringDepositOptions[number] = true;
  }

  updateOneOff(number) {
  	this.oneOffOption = number;
  	this.oneOffOptions = [false,false];
  	this.oneOffOptions[number] = true;
  }

  // Function to update the database for user's selection
  sendOption() {

    if (this.amount < 5) {
      this.presentConfirm("Invalid Amount", "Amount have to be greater than RM5");
      return;
    }

    if (this.oneOffOptions[0]) {
      this.deposit();
    } else {
      this.withdraw();
    } 	
  }

  pressed(number) {

    this.numPadActive[number] = true; 

  	if (this.amount != 0 && number != 10) {
  		this.amount *= 10;
  	}

  	if (number < 10) {
  		this.amount += number*0.01
  	} else if (number == 10) {
  		this.sendOption();
       
  	} else {
  		this.amount = 0;
      console.log(this._data.getSavingsData().subscribe(res => res));

  	}

    // set limit for the amount permitted
    if (this.amount > 1000000) {
      this.amount = 1000000;
    }
 
    setTimeout(() => {
      this.numPadActive[number] = false;  
    }, 300);


  }

  presentConfirm(title, message) {

    
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Stay',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Home',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
  }
  
  deposit() {
    let authHeader = "";
    let url = this._data.API + 'deposits';

    // token and userId is saved in localstorage when user login
    if (localStorage.token && localStorage.userId) {     
      authHeader = btoa(localStorage.userId + ":" + localStorage.token);
    } 

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append("Authorization", "Basic " + authHeader);
    
    let depositObjStr = JSON.stringify({"user_id": localStorage.userId, "value": this.amount * 100}); 
    
    this.http.post(url, depositObjStr, {headers: headers})
    .map(res => res.json())
    .subscribe((data) => {
      console.log(data);
      // display summary, stay on this page or back home
      let depOption = (this.selectedOptions[0] === false) ? "One-Off" : "Recurring";
      let title = 'Deposit/Withdraw Successful';
      let message = 'Amount: RM '+ this.amount.toFixed(2) + ' <br />Type: '+ depOption;

      this.presentConfirm(title, message);
    }, err => {
      let title = 'Deposit/Withdraw Unsuccessful';
      let message = 'Please check your internet connection.';
      this.presentConfirm(title, message);
      console.log(err);
    });
  }

  withdraw() {
    let authHeader = "";
    let url = this._data.API + 'withdrawals';

    // token and userId is saved in localstorage when user login
    if (localStorage.token && localStorage.userId) {     
      authHeader = btoa(localStorage.userId + ":" + localStorage.token);
    } 

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append("Authorization", "Basic " + authHeader);
    
    let withdrawObjStr = JSON.stringify({"user_id":1,"value": this.amount * 100, "from_balance_type":1}); 
    
    this.http.post(url, withdrawObjStr, {headers: headers})
    .map(res => res.json())
    .subscribe((data) => {
      console.log(data);
      // display summary, stay on this page or back home
      let depOption = (this.selectedOptions[0] === false) ? "One-Off" : "Recurring";
      let title = 'Deposit/Withdraw Successful';
      let message = 'Amount: RM '+ this.amount.toFixed(2) + ' <br />Type: '+ depOption;
      
      this.presentConfirm(title, message);
    }, err => {
      let title = 'Deposit/Withdraw Unsuccessful';
      let message = 'Please check your internet connection.';
      this.presentConfirm(title, message);
      console.log(err);
    });
  }
  


}
