import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {

  // Fake Pie Data
  fakePieData = [10,20,25,10,35];
  result: any;
  API = "https://api.qinvest.co/v0/";
  
  portfolio = [];

  
  

  constructor(public _http: HttpClient) {
    // Fake data for line chart
    /*let portfolio = {
        min : [2,4,8,16,32,64],
        mean : [3,9,27,81,243,729],
        max : [4,16,64,256,1024,4096]
    }*/
  }

  getLineData(data) { 
  	return this._http.get("https://min-api.cryptocompare.com/data/histoday?fsym="+ data +"&tsym=USD&limit=30&aggregate=1")
  	  .map(result => this.result = result);
  }

  getSavingsData() {
    let headers = new Headers();
    headers.append('Authorization', 'Basic ' + btoa(localStorage.userId +":"+localStorage.token));

    return this._http.get("https://123:m0SP2kd83C@api.qinvest.co/v0/savings_history?user_id=123&startstamp=2018-02-09T08:00:00Z&endstamp=2018-03-09T07:59:59Z").map(
      result => this.result = result);
  }

  getPieData() {
  	return this.fakePieData;
  }

  getExpenditureData() {
    return this._http.get("https://api.myjson.com/bins/1anni1")
      .map(result => this.result = result);
  }

  getProjectionData(aggresiveness) {
    for (let i = 0; i < 100; i++) {
      this.portfolio.push({x: i, y: i**2});
    }
    return this.portfolio;
  }

}
