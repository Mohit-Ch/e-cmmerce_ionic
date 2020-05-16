import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { AuthProvider } from '../../providers/auth/auth';

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

  categoryId: any = 0;
  subcategoryId: any = 0;
  productList: any = [];
  itemprice: any = "0.00";
  quantity: any = 1;
  ShowAddbutton: any = false;


  searchItem: any = [];
  searchText: any = "";
  name: any = '';
  ShowSearchList: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public model: ModalController, public auth: AuthProvider,
    public toastCtrl: ToastController) {
    this.categoryId = this.navParams.data["categoryId"];
    this.subcategoryId = this.navParams.data["subcategoryId"];
    this.name = this.navParams.data['name'];
  }

  ionViewDidLoad() {
    this.getproductList();
  }

  getproductList() {
    let loading = this.auth.loadginFactory();
    this.auth.getproductList(this.categoryId, this.subcategoryId).subscribe(res => {
      loading.dismiss();
      if (res["status"] == 'success') {
        if (res["data"] != '') {
          this.productList = res["data"];

          this.productList.forEach(x => {
            x["ShowAddbutton"] = false;
            x["maxquantity"] = 1;
            if (x["Edition"] != [] && x["Edition"].length > 0) {
              x["price"] = x["Edition"][0]["price"];
              if (x["Edition"][0].quantity > 0) {
                x["ShowAddbutton"] = true;
              }
              else {
                x["ShowAddbutton"] = false;
              }
              x["EditionId"] = x["Edition"][0]["id"];
              x["maxquantity"] = x["Edition"][0]["quantity"];
            }
            x["quantity"] = 1;
          });

        }
      }
    });
  }

  ProductDetail(item) {

    this.navCtrl.push(ProductDetailPage, {
      productId: item
    });
  }
  addtoCartClick(item: any) {
    this.auth.setorderincart(item["id"], item["EditionId"], item["quantity"]);
    // this.presentToast("product Add to cart succefully")
  }
  datachange(item) {
    if (item != undefined) {
      if (item["Edition"].length > 0) {
        item["Edition"].forEach(x => {
          if (x["id"] == item["EditionId"]) {
            item["price"] = x["price"];
            item["quantity"] = 1;
          }

        });
      }

    }
  }

  // Present toast page
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: "top"
    });
    toast.present();
  }

  search(ev) {
    let Searchtext = ev.target.value;;
    if (Searchtext != "") {
      let loading = this.auth.loadginFactory();
      this.auth.getSearchProduct(Searchtext).subscribe(res => {
        loading.dismiss();
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
}
