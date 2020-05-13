import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { SubcategoryPage } from '../subcategory/subcategory';

/**
 * Generated class for the CategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public modal:ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryPage');
  }

  subcategory()
  {
   
    // const allComments = this.modal.create(SubcategoryPage);
    // allComments.present();
     this.navCtrl.push(SubcategoryPage);
  }
}
