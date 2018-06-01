import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, MenuController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { WelcomePage } from '../welcome/welcome';
import { SignupPage } from '../signup/signup';

export interface Slide {
  title: string;
  description: string;
  image: string;
}

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
})
export class TutorialPage {

  slides: Slide[];
  showSkip = true;
  dir: string = 'ltr';


  constructor(public navCtrl: NavController, public menu: MenuController, public platform: Platform ,public navParams: NavParams) {
  	this.dir = platform.dir();
  	this.slides = [
  	  {
  	    // Edit the title and the description over here
  	    title: 'Welcome to Q-Invest',
  	    description: 'Saving while you are spending.',
  	    image: 'assets/imgs/ica-slidebox-img-1.png',
  	  },
  	  {
  	    title: 'Real Time',
  	    description: 'View the real time growth of your investment portfolio.',
  	    image: 'assets/imgs/ica-slidebox-img-2.png',
  	  },
  	  {
  	    title: 'Promotion',
  	    description: 'Get awesome promotions and discount from shops.',
  	    image: 'assets/imgs/ica-slidebox-img-3.png',
  	  }
  	];

  }

  startApp(params){
    if (!params) params = {};
    this.navCtrl.setRoot(WelcomePage);
  }

  onSlideChangeStart(slider) {
    this.showSkip = !slider.isEnd();
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
