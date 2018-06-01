import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TutorialPage } from '../tutorial/tutorial';
import { PaymentPage } from '../payment/payment';
import { DataProvider } from '../../providers/data/data';
import { Chart } from 'chart.js';
import { Http, Headers } from "@angular/http";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  currentInvestedAmount = 0;
  amount = 0;
  period = "30 days";
  chart = [];
  data = ["BTC","ETH","LTC","IOT"];
  //current_active = 0;
  is_active = [false, false, true, false];
  loading = true;

  constructor(public navCtrl: NavController, private _data: DataProvider, 
              public http: Http) {
    //this.getSavingsHistory();
    //this.getTotalAmount();
  }

  update(period) { // period: 0 = daily, 1 = weekly, 2 = monthly, 3 = yearly
    // var elem = document.getElementById("canvas");
    // elem.parentNode.removeChild(elem);

    // var canvas = document.createElement("canvas");
    // canvas.setAttribute("id","canvas");
    // canvas.setAttribute("width","100%");
    // canvas.setAttribute("height","80%");
    // var parent = document.getElementById("div1");
    // parent.appendChild(canvas);

    document.getElementById('div1').innerHTML = '';
    this.loading = true;
  	//this.getLineChart(this.data[period]);
  	// document.getElementById("active" + this.current_active.toString()).classList.remove("active");
  	// this.current_active = period;
  	// document.getElementById("active" + period.toString()).className = "active";
    for (let i=0; i < this.is_active.length; i++) {
      if (i==period){
        this.is_active[i] = true;
      } else {
        this.is_active[i] = false;
      } 
    }
    
    this.getLineChart(null);
  }

  goToPayment(params){
    if (!params) params = {};
    this.navCtrl.push(PaymentPage);
  }

  ionViewDidLoad() {// Ionic 2 built-in life cycle hook which executes when the page first loads												
  	//this.getLineChart(this.data[0]);
  	//document.getElementById("active" + this.current_active.toString()).className = "active";
  }
  //prevent ionic default caching behaviour
  ionViewDidEnter(){
    this.loading = true;
    this.getSavingsHistory();
  }

  // Get the data from data.ts provider and then displays it 
  getLineChart(data) {
    
    this.loading = false;
    document.getElementById('div1').innerHTML = '<canvas id="canvas" width="100%" height="80%"></canvas>';

    let dataPoints = [];
    let dataLabels = [];
    
    //data from API
    if (data != null) { 
      let last = data.length - 1;

      for (let i = 0; i < data.length; i++) {
        dataPoints.push((data[i].value/100).toFixed(2));
        dataLabels.push(data[i].stamp.slice(0, 10));
      }

      localStorage.savingHistoryMonth = JSON.stringify({
        'data': dataPoints,
        'label': dataLabels
      });
    } else {
      let savingHistoryMonth = JSON.parse(localStorage.savingHistoryMonth);

      // week is selected
      if (this.is_active[1]) {      
        dataPoints = savingHistoryMonth.data.slice(0, 8);
        dataLabels = savingHistoryMonth.label.slice(0, 8);
      } else {
        dataPoints = savingHistoryMonth.data;
        dataLabels = savingHistoryMonth.label;
      }
    }
    setTimeout(() => {
      this.chart = new Chart('canvas', {      // 'canvas' is the element ID
        type: 'line',
        data: {
          labels: dataLabels,
          datasets: [{
            data: dataPoints,
            borderColor: 'black',
            fill: false,
            pointRadius: 0,
            pointHitRadius: 30,
          }],
        },
        options: {
          tooltips: {
            callbacks: {
              label: function(tooltipItems, data) {
                return "RM" + tooltipItems.yLabel.toString();
              }
            }
          },
        responsive: true,
        legend: {
          display: false
        },
          scales: {
            xAxes: [{
              display: false
            }],
            yAxes: [{
              display: false
            }]
          }                        
        }
      });
      //console.log(JSON.parse(localStorage.savingHistoryMonth));
    });
  }

  getSavingsHistory() {
    let authHeader = "";
    let url = this._data.API + 'savings_history?user_id=';

    // token and userId is saved in localstorage when user login
    if (localStorage.token && localStorage.userId) {
      authHeader = btoa(localStorage.userId + ":" + localStorage.token);

      // get timestamp for 30days ago
      let timeStamp = Date.now() - 3600*24*30*1000; 
      let startDate = new Date(timeStamp).toISOString();
      let endDate = new Date().toISOString();

      url += localStorage.userId; 
      url += '&startstamp=';
      url += startDate.slice(0,-5) + startDate.slice(-1); //remove milliseconds
      url += '&endstamp=';
      url += endDate.slice(0,-5) + endDate.slice(-1);
      //console.log(url);
    } 

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append("Authorization", "Basic " + authHeader);
    
    this.http.get(url, {headers: headers})
    .map(res => res.json())
    .subscribe((data) => {
      this.getLineChart(data);
      //2nd API
      this.getTotalMoney(data);
    }, err => {
      console.log(err);
    });

  }

  getTotalMoney(savingData) {
    let authHeader = "";
    let url = this._data.API + 'users/';

    // token and userId is saved in localstorage when user login
    if (localStorage.token && localStorage.userId) {    
      authHeader = btoa(localStorage.userId + ":" + localStorage.token);
      url += localStorage.userId;
    } 

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append("Authorization", "Basic " + authHeader);
    console.log(url);
    this.http.get(url, {headers: headers})
    .map(res => res.json())
    .subscribe((data) => {
      console.log(data);
      let last = savingData.length - 1;

      
      let currentInvestedAmount = ((data.balance_roundup + data.balance_neutral + data.balance_investment + data.balance_ready_for_investment)/100).toFixed(2);

      let amount = (Number(currentInvestedAmount) - Number(savingData[0].value)/100).toFixed(2);

      // this.currentInvestedAmount = currentInvestedAmount.toString();
      // this.amount = amount.toString();

      localStorage.totalMoney = currentInvestedAmount;
      localStorage.last30_amt = amount;

      let count1 = 0;
      let timer1 =  setInterval(() => {
        count1 += Math.ceil(Number(amount)/30);
        document.getElementById('last30_amt').innerHTML = "RM " + count1.toString();

        if (Number(count1) > Number(amount)) {
          document.getElementById('last30_amt').innerHTML = 
                                                      "RM " + amount.toString();
          clearInterval(timer1);                                                    
        }
      }, 40);

      let count2 = 0;
      let timer2 =  setInterval(() => {
        count2 += Math.ceil(Number(currentInvestedAmount)/30);
        document.getElementById('total-amt').innerHTML = "RM " + count2.toString();

        if (Number(count2) > Number(currentInvestedAmount)) {
          document.getElementById('total-amt').innerHTML = 
                                        "RM " + currentInvestedAmount.toString();
          clearInterval(timer2);                                                    
        }
      }, 40);

    }, err => {
      
      console.log(err);
    });
  }

}
