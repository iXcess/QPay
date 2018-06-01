import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Contacts, ContactFieldType, IContactFindOptions } from '@ionic-native/contacts';

import { AlertController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { SplitbillfinalPage } from '../splitbillfinal/splitbillfinal';

/* This page is actually the contacts
*/

@IonicPage()
@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})
export class ContactsPage {

  ourtype: ContactFieldType[] = ["displayName"];
    contactsFound = [];
    pageTitle = "CONTACTS";
    splitBillView = false;
    contactsView = true;
    selected = [];
    // Storing the total amount from history.ts for split the bill
    totalAmount = null;

    constructor(private sanitizer: DomSanitizer, private alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private contacts: Contacts) {
    	this.search('');
    }

    search(q) {

    	const option: IContactFindOptions = {
    		filter: q
    	}

      this.contacts.find(
            ["displayName", "phoneNumbers","photos"],
            {multiple: true, hasPhoneNumber: true}
            ).then((contacts) => {
              for (let i=0 ; i < contacts.length; i++){
                if(contacts[i].displayName !== null) {
                  let contact = {};
                  contact["name"]   = contacts[i].displayName;
                  contact["number"] = contacts[i].phoneNumbers[0].value;
                  if(contacts[i].photos != null) {
                    console.log(contacts[i].photos);
                    contact["image"] = this.sanitizer.bypassSecurityTrustUrl(contacts[i].photos[0].value);
                    console.log(contact);
                  } else {
                    contact["image"] = "assets/dummy-profile-pic.png";
                  }
                  this.contactsFound.push(contact);
                }
              }
          });

    }

    onKeyUp(event) {
    	this.search(event.target.value);
    }

    displayInfo() {
      // Show contacts payment history
    }

    select(contact) {

      let index = this.selected.indexOf(contact);
      if (index !== -1) {
        this.selected.splice(index,1);
      }
      else {
        this.selected.push(contact);
      }
    }

    sendPaymentRequest() {
      this.navCtrl.push(SplitbillfinalPage, {contact: this.selected, amount: this.totalAmount});
    }

    ionViewDidLoad() {
      if (this.navParams.get('total') != null) {
        this.totalAmount = this.navParams.get('total');
        this.pageTitle = "SPLIT THE BILL";
        this.splitBillView = true;
        this.contactsView = false;
      } 
      
    }
    
    presentConfirm(title,subTitle) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: subTitle,
        buttons: ['Dismiss']
      });
      alert.present();
    }

}
