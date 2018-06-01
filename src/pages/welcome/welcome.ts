import { Http, Headers } from "@angular/http";
import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { DataProvider } from '../../providers/data/data';


/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})

export class WelcomePage {

  // Our translated text strings
  private loginErrorString: string;
  private loginSuccessString: string;
  private form: any;
  

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public _data: DataProvider,
              public http: Http) {
    
    this.form = {
      email: "",
      password: ""
    };

    this.loginErrorString = "Invalid Credentials"; 
    this.loginSuccessString = "Successful Login"; 
  }

  // Attempt to login in through our User service
  doLogin() {
    
    
    let headers = new Headers();
    headers.append('Content-Type','application/json');

    this.http.post(this._data.API + "login", JSON.stringify(this.form), {headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      
      localStorage.userId = data.id;
      localStorage.userType = data.type; //1 for normal user,2 for merchant 
      localStorage.token = data.auth_token;
      
      let toast = this.toastCtrl.create({
        message: this.loginSuccessString,
        duration: 2000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot(HomePage);

    }, err => {
      console.log(err);
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 2000,
        position: 'top'
      });
      toast.present();
    });

    // this.user.login(this.account).subscribe((resp) => {
    //   this.navCtrl.push(HomePage);
    // }, (err) => {
    //   this.navCtrl.push(HomePage);
    //   // Unable to log in
    //   let toast = this.toastCtrl.create({
    //     message: this.loginErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

}
