import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { Chart } from 'chart.js';
import { ProgressBar } from 'progressbar.js';
import { PaymentPage } from '../payment/payment';
import { SplitbillPage } from '../splitbill/splitbill';
import { DataProvider } from '../../providers/data/data';
import { Http, Headers } from "@angular/http";

// export interface Entity {
// 	date: string;
// 	transactions: ;
// }

declare var require: any;

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  
  chart = [];
  pie = [];
  entities: any[];
  type = null;
  merchantName = null;

  notSplitBillMode = true;
  loading = true;


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
    
  }

  ionViewDidEnter() {
    if (this.navParams.get('status')) {
      this.notSplitBillMode = false;
    } 
    this.getPieChart(); 
    
    setTimeout(() => {
      let ProgressBar = require('progressbar.js')
      let turbo = new ProgressBar.Circle('#progress', {
          color: '#83CBB7',
          duration: 3000,
          easing: 'easeInOut',
          strokeWidth: 4,
          step: function(state, circle) {
            let value = Math.round(circle.value() * localStorage.totalMoney);
            if (value === 0) {
              circle.setText('');
            } else {
              circle.setText('RM' + value);
            }
          }
      });
      turbo.text.style.fontSize = '45px';
      turbo.text.style.color = '#E0E0E0';
      turbo.animate(1);
    }, 1);

  }

  toggleInfo(data) {
    if (this.navParams.get('status')) {
      this.navCtrl.push(SplitbillPage, data);
    } else {
      console.log("False");
    }

  }

  ionViewDidLoad() {
    this.getTransactionHistory();
  }

  getPieChart() {

  	let pieData = [30, 20, 10, 30, 10];
    let pieLabels = ['Food', 'Entertainment', 'Transport', 'Grocery', 'Fashion'];
    
    // console.log(pieLabels);
  	setTimeout(() => {
      document.getElementById('pie_div').innerHTML = '<canvas id="pie"></canvas>'; 
      this.loading = false;
  		this.chart = new Chart('pie', {	
  			type: 'pie',
  			data: {
  				datasets: [{
  					data: pieData,
  					backgroundColor: ['transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
            borderColor: ['#009688', '#2196F3', '#E91E63', '#673AB7', '#FF9800'],
            hoverBackgroundColor: ['#E0F2F1', '#E3F2FD', '#FCE4EC', '#EDE7F6', '#FFF3E0'],
  				}],
          labels: pieLabels,
  			},   
        options: {
          legend: {
            display: false
          },
          animation: {
            onComplete: function () {
              var ctx = this.chart.ctx;
              ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              this.data.datasets.forEach(function (dataset) {

                for (var i = 0; i < dataset.data.length; i++) {
                  var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                      total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                      mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                      start_angle = model.startAngle,
                      end_angle = model.endAngle,
                      mid_angle = start_angle + (end_angle - start_angle)/2;

                  var x = mid_radius * Math.cos(mid_angle);
                  var y = mid_radius * Math.sin(mid_angle);

                  switch (i) {
                    case 0:
                      ctx.fillStyle = '#009688';
                      break;
                    case 1:
                      ctx.fillStyle = '#2196F3';
                      break;
                    case 2:
                      ctx.fillStyle = '#E91E63';
                      break;
                    case 3:
                      ctx.fillStyle = '#673AB7';
                      break;
                    case 4:
                      ctx.fillStyle = '#FF9800';
                      break;
                    default:
                      ctx.fillStyle = 'black';
                      break;
                  }
                  var percent = String(Math.round(dataset.data[i]/total*100)) + "%";

                  ctx.fillText(percent, model.x + x, model.y + y + 10);
                }
              });               
            }
          }
        }
  		});
  		
  	}, 100);
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

        // Get merchant type and name
        this.getMerchantName(merchantID);
        console.log(this.merchantName,this.type);



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

  getMerchantName(id) {
    let authHeader = "";
    let url = this._data.API + 'merchants/' + id;

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
    
    this.http.get(url, {headers: headers})
    .map(res => res.json())
    .subscribe((data) => {
      this.merchantName = data.name;
      this.type = data.product_category_id;
    } , err => {
      console.log(err);
    });

  }



}
