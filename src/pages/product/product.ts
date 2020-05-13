import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';

/**
 * Generated class for the ProductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-product',
  templateUrl: 'product.html',
})
export class ProductPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public model:ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductPage');
  }
 
  ProductDetail()
  {
    this.navCtrl.push(ProductDetailPage);
  }
}
