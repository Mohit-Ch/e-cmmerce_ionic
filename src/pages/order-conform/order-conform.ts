import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, public app:App) {
    this.status = this.navParams.data["status"];
    if(this.status=="success")
    {
      this.orderId= this.navParams.data["orderId"];
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderConformPage');
  }

  continue()
  {
    this.app.getRootNav().setRoot(TabsPage);
  }

}
