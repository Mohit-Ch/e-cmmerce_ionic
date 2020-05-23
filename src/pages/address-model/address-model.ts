import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the AddressModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-address-model',
  templateUrl: 'address-model.html',
})
export class AddressModelPage {

  api_token: any;
  callApiAddress: any = false;
  callAddressList: any = [];
  addressStorage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public auth: AuthProvider) {
    if (this.auth.authUser != null) {
      this.api_token = this.auth.authUser["api_token"];
      console.log(this.api_token);
      if (this.api_token != null && this.api_token != undefined) {
        this.callApiAddress = true;
      }
      else {
        this.callApiAddress = false;
      }
    } else {
      this.callApiAddress = false;
    }
    this.GetAddressList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressModelPage');
  }

  GetAddressList() {
    if (this.api_token != undefined) {
      if (this.api_token != null) {
        this.auth.getAddressList(this.api_token).subscribe(x => {
          console.log(x);
          if (x["status"] == "success") {
            if (x["data"] != "") {
              if (x["data"].length > 0) {
                this.callAddressList = x["data"];

              }
              else {
                this.getaddressforstorage();
              }
            } else {
              this.getaddressforstorage();
            }
          } else {
            this.getaddressforstorage();
          }
        })
      }
    }
    else {
      this.getaddressforstorage();
    }
  }

  getaddressforstorage() {
    this.auth.getAddressStorage().then(x => {
      if (x != undefined) {
        this.addressStorage = {
          id: 0,
          address1: x["address"],
          city: x.city,
          country: x.country,
          postal_code: x.postalcode,
          name: x.name,
          email: x.email,
          phone_no: x.Phone,
          company_name: x.companyName
        }
      }
    })
  }
  onclickgrid(item) {
    let data = {
      foo: "success",
      type: "old",
      address: item
    };
    this.viewCtrl.dismiss(data);
  }

  AddNewAddress() {
    let data = {
      foo: "success",
      type: "new"
    };
    this.viewCtrl.dismiss(data);

  }

  closeModal() {
    let data = { foo: "bar" };
    this.viewCtrl.dismiss(data);
  }

}
