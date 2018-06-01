import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';
import { Chart } from 'chart.js';
import { Http, Headers } from "@angular/http";

@IonicPage()
@Component({
  selector: 'page-portfolio',
  templateUrl: 'portfolio.html',
})
export class PortfolioPage {
  @ViewChild(Slides) slides: Slides;

  totalAmount = 0;
  profitLoss = 0.10;
  aggresiveness = [true,false,false];								// Boolean for ngIf to display the slide component
  aggresivenessName = ["Conservative","Moderate","Aggresive"];
  currentAggresivenessName: string;
  index: number;
  pieData = [];
  chart = [];															// Line chart array for the data
  pie = [];																// Pie chart array for the distribution of funds in an ETF								// Temp data
  loading = true;
  projection = {
    'age': 20,
    'value': localStorage.totalMoney,
    'monthlyAmt': "+0.141%"
  };

  portfolioType = [
    {
      "first": {
        "name": "Local Stocks",
        "percentage": "7"
      },
      "second": {
        "name": "Foreign Stocks",
        "percentage": "0"
      },
      "third": {
        "name": "Bonds",
        "percentage": "70"
      },
      "forth": {
        "name": "Commodities",
        "percentage": "23"
      }
      // "fifth": {
      //   "name": "TRADEPLUS SHARIAH GOLD TRACKER",
      //   "percentage": "24"
      // }
    },
    {
      "first": {
        "name": "Local Stocks",
        "percentage": "23"
      },
      "second": {
        "name": "Foreign Stocks",
        "percentage": "23"
      },
      "third": {
        "name": "Bonds",
        "percentage": "40"
      },
      "forth": {
        "name": "Commodities",
        "percentage": "14"
      }
      // "fifth": {
      //   "name": "MyETF MSCI SEA ISLAMIC DIVIDEND",
      //   "percentage": "24"
      // }
    },
    {
      "first": {
        "name": "Local Stocks",
        "percentage": "40"
      },
      "second": {
        "name": "Foreign Stocks",
        "percentage": "38"
      },
      "third": {
        "name": "Bonds",
        "percentage": "11"
      },
      "forth": {
        "name": "Commodities",
        "percentage": "11"
      }
      // "fifth": {
      //   "name": "TRADEPLUS SHARIAH GOLD TRACKER",
      //   "percentage": "24"
      // }
    }

  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private _data: DataProvider, public http: Http) {
  	this.index = 0;														// Initialising index to 0 everytime when load    
  }

  ionViewDidLoad() {													// Ionic 2 built-in life cycle hook which executes when the page first loads	
  }
  
  //prevent default caching behaviour in ionic
  ionViewDidEnter(){
    this.showTotalAmt();
    this.showChangeAmt();
    this.update();
    this.getHomeChart();
    this.getPortfolioData();
  }
  // Function to increase the index and update the aggresiveness array boolean value
  nextAggresiveness() {

  	if (this.index + 1 < this.aggresiveness.length) {
      // var elem = document.getElementById("canvas");
      // elem.parentNode.removeChild(elem);

      // var canvas = document.createElement("canvas");
      // canvas.setAttribute("id","canvas");
      // var parent = document.getElementById("div1");
      // parent.appendChild(canvas);     

  		this.aggresiveness[this.index + 1] = true;
  		this.aggresiveness[this.index] = false;
  		this.index++;
  		this.update();
  	}

  }

  // Function to decrease the index and update the aggresiveness array boolean value
  prevAggresiveness() {

  	if (this.index != 0) {
      // var elem = document.getElementById("canvas");
      // elem.parentNode.removeChild(elem);

      // var canvas = document.createElement("canvas");
      // canvas.setAttribute("id","canvas");
      // var parent = document.getElementById("div1");
      //parent.appendChild(canvas);
      
      
  		this.aggresiveness[this.index - 1] = true;
  		this.aggresiveness[this.index] = false;
  		this.index--;
  		this.update();
  	}

  }
  
  // Function to update the charts when a click event happens
  update() {

  	this.currentAggresivenessName = this.aggresivenessName[this.index];

  	// this.getLineChart(this.index,this.data[this.index]);
  	this.getPieChart(this.index); 
    if(localStorage.portfolio) {
      this.getLineChart();
    }
   
  }

  // More information about Chart.js , visit http://www.chartjs.org/docs/latest/
  
  // Get the data from data.ts provider and then displays it 
  getLineChart() {
    
      let portfolio = JSON.parse(localStorage.portfolio);
      let i = 0;

      for (i = 0; this.aggresiveness.length; i++) {
        if (this.aggresiveness[i]) break;
      } 

      let r = portfolio[i].expected_returns / 100000; 
      document.getElementById('monthly').innerHTML = 
                    "+" + (portfolio[i].expected_returns/1000).toFixed(3) + "%";

      let y = [];
      let label = [];

      for (let i = 1; i <= 80; i++) {
        label.push(i+20);
        y.push((Number(localStorage.totalMoney) * Math.pow((1 + r), i*12)).toFixed(2));
      }
      //console.log(label);
      //console.log(y);
      //initialise the values in box
      document.getElementById('projection_age').innerHTML = label[0];
      document.getElementById('projection_value').innerHTML = y[0];

      document.getElementById('projection_graph').innerHTML = "";
      document.getElementById('projection_graph').innerHTML = "<canvas id='canvas' width='100%' height='90%'></canvas>";

      this.chart = new Chart('canvas', {      // 'canvas' is the element ID
        type: 'line',
        data: {
          labels: label,
          datasets: [{
            data: y,
            borderColor: 'black',
            fill: false,
            pointRadius: 0,
            pointHitRadius: 30,
            borderWidth: 2,
          }],
        },
        options: {
          tooltips: {
            callbacks: {
              label: function(tooltipItems, data) {
                document.getElementById('projection_age').innerHTML = tooltipItems.xLabel;
                document.getElementById('projection_value').innerHTML = tooltipItems.yLabel;
                return "RM" + tooltipItems.yLabel.toString();
              }
            }
          },
        //responsive: true,
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true,
              gridLines: {
                  display: false
              }
            }],
            yAxes: [{
              display: true,
            }]
          }                        
        }
      });

      /*
      this.chart = new Chart('canvas', { // 'canvas' is the element ID
          type: 'line',
          data: {
            labels: label,
            datasets: [{
                data: y,
                borderColor: 'black',
                borderWidth: 2,
                fill: false,
                pointRadius: 0,
                pointHitRadius: 30,
            }]
          },
          options: {
              scales: {
                  xAxes: [{
                      type: 'linear',
                      position: 'bottom',
                      gridLines: {
                        display: false
                      },
                  }],
                  yAxes: [{
                      gridLines: {
                        display: false
                      },
                  }]
              },
              tooltips: {
                  callbacks: {
                      label: function(tooltipItems, data) {
                          return "RM" + tooltipItems.yLabel.toString();
                      }
                  }
              },
              elements: {
                line: {
                  tension: 0
                }
              },
              legend: {
                display: false
              },

          }
      });
      */
  }
  // ['#ff6384', '#36a2eb', '#cc65fe', 'black','yellow']
  // Get pie data from data.ts provider and then displays it
  getPieChart(index) {
    /*
    let portfolio = JSON.parse(localStorage.portfolio);
    let i = 0;
    for (i = 0; this.aggresiveness.length; i++) {
      if (this.aggresiveness[i]) break;
    } 
    
    let pieData = [];
    let pieLabel = [];

    for (let j = 0; i < 5; i++) {
      pieData.push(portfolio[i].composition[j].percentage);
      pieLabel.push(portfolio[i].composition[j].name);

    }
    */
    let pieData = [
      this.portfolioType[index].first.percentage,
      this.portfolioType[index].second.percentage,
      this.portfolioType[index].third.percentage,
      this.portfolioType[index].forth.percentage,
      //this.portfolioType[index].fifth.percentage
    ];

    let pieLabel = [
      this.portfolioType[index].first.name,
      this.portfolioType[index].second.name,
      this.portfolioType[index].third.name,
      this.portfolioType[index].forth.name,
      //this.portfolioType[index].fifth.name
    ]; 

    let backgroundColor = ['transparent', 'transparent', 'transparent', 'transparent', 'transparent'];
    let borderColor = ['#009688', '#2196F3', '#E91E63', '#673AB7', '#FF9800'];
    let hoverBackgroundColor = ['#E0F2F1', '#E3F2FD', '#FCE4EC', '#EDE7F6', '#FFF3E0'];

    //remove the 0% portfolio
    if (index == 0) {
      pieData.splice(1, 1);
      pieLabel.splice(1, 1);
      backgroundColor.splice(1, 1);
      borderColor.splice(1, 1);
      hoverBackgroundColor.splice(1, 1);
    }

  	setTimeout(() => {
      //clear existing pie
      let pieDivRef = document.getElementById('pie_div'); 
      pieDivRef.innerHTML = '<canvas id="pie"></canvas>';

  		this.chart = new Chart('pie', {						// 'pie' is the element ID
  			type: 'doughnut',
  			data: {
  				datasets: [{
  					data: pieData,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            //hoverBorderColor: ['transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
            hoverBackgroundColor: hoverBackgroundColor,
            borderWidth: 2,
  				}],
          labels: pieLabel,
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

                  // ctx.fillStyle = '#fff';
                  // if (i == 3){ // Darker text color for lighter background
                  //   ctx.fillStyle = '#444';
                  // }
                  // ['#009688', '#2196F3', '#E91E63', '#673AB7', '#FF9800']
                  // switch (i) {
                  //   case 0:
                  //     ctx.fillStyle = '#009688';
                  //     break;
                  //   case 1:
                  //     ctx.fillStyle = '#2196F3';
                  //     break;
                  //   case 2:
                  //     ctx.fillStyle = '#E91E63';
                  //     break;
                  //   case 3:
                  //     ctx.fillStyle = '#673AB7';
                  //     break;
                  //   case 4:
                  //     ctx.fillStyle = '#FF9800';
                  //     break;
                  //   default:
                  //     ctx.fillStyle = 'black';
                  //     break;
                  // }
                  ctx.fillStyle = borderColor[i];
                  
                  var percent = String(Math.round(dataset.data[i]/total*100)) + "%";
                  //ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                  // Display percent in another line, line break doesn't work for fillText
                  ctx.fillText(percent, model.x + x, model.y + y + 15);
                }
              });               
            }
          }
        }
  		});

  	}, 100);
  }

  getHomeChart() {

    let dataHistory = JSON.parse(localStorage.savingHistoryMonth);

    //replace loading gif with canvas 
    this.loading = false;
    document.getElementById('graph_div').innerHTML = 
                            "<canvas id='canvas_home' width='100%'></canvas>";
    //console.log(document.getElementById('canvas_home'));

    setTimeout(() => {
      let homeChart = new Chart('canvas_home', {      // 'canvas' is the element ID
        type: 'line',
        data: {
          labels: dataHistory.label,
          datasets: [{
            data: dataHistory.data,
            borderColor: 'black',
            borderWidth: 2,
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
    });
  }

  getPortfolioData() {

    let authHeader = "";
    let url = this._data.API + 'portfolio';

    // token and userId is saved in localstorage when user login
    if (localStorage.token && localStorage.userId) {    
      authHeader = btoa(localStorage.userId + ":" + localStorage.token);
    } 

    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append("Authorization", "Basic " + authHeader);

    this.http.get(url, {headers: headers})
    .map(res => res.json())
    .subscribe((data) => {
      console.log(data);
      localStorage.portfolio = JSON.stringify(data);
      setTimeout(() => {
        this.getLineChart();
      });
      
       
    }, err => {
      
      console.log(err);
    });
  }

  showTotalAmt() {
    let count1 = 0;
    let amt = localStorage.totalMoney;

    let timer1 =  setInterval(() => {
      count1 += Math.ceil(amt/30);
      document.getElementById('total-amt-money').innerHTML = "RM " + count1.toString();

      if (count1 > amt) {
        document.getElementById('total-amt-money').innerHTML = 
                                                    "RM " + amt.toString();
        clearInterval(timer1);                                                    
      }
    }, 40);
  }

  showChangeAmt() {
    let percentChange = ((Number(localStorage.last30_amt) / Number(localStorage.totalMoney)) * 100).toFixed(2);

    let str = "|&nbsp;";
    str += Number(localStorage.last30_amt) > 0 ? '+': '-';
    str += "RM " + localStorage.last30_amt + "/ ";
    str += percentChange + "%&nbsp;|";

    setTimeout(() => {
      document.getElementById('change_amt').innerHTML = str;
    });  
  }
  	
}
