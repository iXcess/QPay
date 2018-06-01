import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ContactsPage } from '../contacts/contacts';
import { DataProvider } from '../../providers/data/data';
import { Http, Headers } from "@angular/http";

// export interface Entity {
//   date: string;
//   transactions: object;
// }

@IonicPage()
@Component({
  selector: 'page-splitbill',
  templateUrl: 'splitbill.html',
})
export class SplitbillPage {

  entities: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private _data: DataProvider, public http: Http) {

      // This is dummy data
      this.entities = [
        {
        date: "2018/02/02",
        transactions: [
          {
            amount: 0.50,
            type: "McDonalds",
            total: 6.50,
          }
        ]
        },
      ];

      this.getTransactionHistory();
  }

  toggleInfo(data) {
    this.navCtrl.push(ContactsPage, data);
  }

  getTransactionHistory() {
    let authHeader = "";
    let url = this._data.API + 'sales?user_id=';

    // token and userId is saved in localstorage when user login
    if (localStorage.token && localStorage.userId) {
      authHeader = btoa(localStorage.userId + ":" + localStorage.token);

      // get timestamp for 30days ago
      let timeStamp = Date.now() - 3600*24*30*1000; 
      let startDate = new Date(timeStamp).toISOString();
      let endDate = new Date().toISOString();

      url += localStorage.userId; 
      url += '&startstamppaid=';
      url += startDate.slice(0,-5) + startDate.slice(-1); //remove milliseconds
      url += '&endstamppaid=';
      url += endDate.slice(0,-5) + endDate.slice(-1);

    } else {
      // FOR DEV ONLY  to be remove for production 
      authHeader = btoa('1:349867d9f10502ccbbee2f24e5da1979859183304c5f36cabd901168c770db05');
      url += '1&startstamppaid=2018-02-09T08:00:00Z&endstamppaid=2018-03-09T07:59:59Z';
    }

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append("Authorization", "Basic " + authHeader);
    
    return this.http.get(url, {headers: headers})
    .map(res => res.json())
    .subscribe( (data) => {
      // function that appends to the entity[]
      for(let transaction in data) {
        console.log(data[transaction]);

        // Reinitialise for readability
        let trans = data[transaction];

        // Remove the ending milliseconds then format it to yy/mm/dd
        let date = trans.stamp_paid.slice(0,-14).split("-");
        date = date.join("/")

        let merchantID = trans.merchant_id;

        let value = trans.value / 100;
        let roundUp = trans.value_roundup / 100;

        // If its on the same day
        if (this.entities[this.entities.length -1].date == date) {
          this.entities[this.entities.length -1].transactions.push({
            amount: roundUp,
            type: "Isetan",
            total: value
          });
        }
        else {
          this.entities.push({
            date: date,
            transactions: [{
              amount: roundUp,
              type: "Isetan",
              total: value
            }]
          });
        }

      }
    } , err => {
      console.log(err);
    });

  }



  
}
