import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the OrderConformPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-conform',
  templateUrl: 'order-conform.html',
})
export class OrderConformPage {

  status:any="error";
  orderId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.status = this.navParams.data["status"];
    if(this.status=="success")
    {
      this.orderId= this.navParams.data["orderId"];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderConformPage');
  }

}
