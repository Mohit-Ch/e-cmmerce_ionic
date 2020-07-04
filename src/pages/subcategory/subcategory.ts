import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductPage } from '../product/product';
import { AuthProvider } from '../../providers/auth/auth';
import { ProductDetailPage } from '../product-detail/product-detail';

/**
 * Generated class for the SubcategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-subcategory',
  templateUrl: 'subcategory.html',
})
export class SubcategoryPage {

  SubcategoryList: any = [];
  categoryId: any = 0;
  searchItem: any = [];
  searchText: any = "";
  ShowSearchList: any = false;
  categoryName: any = '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider) {
    this.categoryId = this.navParams.data["CategoryId"];
    this.getsubCategoryList();
    this.categoryName = this.navParams.data['name'];
  }

  ionViewDidLoad() {

  }

  getsubCategoryList() {
    let loading = this.auth.loadginFactory();
    this.auth.getsubCategoryList(this.categoryId).subscribe(res => {
      loading.dismiss();
      console.log(res);
      if (res["status"] == 'success') {
        if (res["data"] != '') {
          this.SubcategoryList = res["data"];
        }
      }
    });
  }

  productclick(item: any) {
    this.navCtrl.push(ProductPage, {
      categoryId: this.categoryId,
      subcategoryId: item['id'],
      name: item['Subcategory_name']
    });
  }

  search(ev) {
    let Searchtext = ev.target.value;;
    if (Searchtext != "") {
      let loading = this.auth.loadginFactory();
      this.auth.getSearchProduct(Searchtext).subscribe(res => {
        loading.dismiss();
        console.log(res);
        if (res["status"] == 'success') {
          if (res["data"] != '') {
            this.searchItem = res["data"];
            if (this.searchItem.length > 0) {
              this.ShowSearchList = true;
            }
            else {
              this.ShowSearchList = false;
            }

          }
          this.searchItem = res["data"];
        }
        else {
          this.searchItem = [];
          this.ShowSearchList = false;
        }
      });
    }
  }
  dataclick(data) {
    this.navCtrl.push(ProductDetailPage, {
      productId: data["id"]
    });
  }

  doRefresh(event) {
    let env = this;
    env.getsubCategoryList();
    setTimeout(() => {

      event.complete();
    }, 2000);
  }


}
