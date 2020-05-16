import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { SubcategoryPage } from '../subcategory/subcategory';
import { AuthProvider } from '../../providers/auth/auth';
import { ProductPage } from '../product/product';
import { ProductDetailPage } from '../product-detail/product-detail';

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

  categoryList: any = [];
  searchItem: any = [];
  searchText: any = "";
  ShowSearchList: any = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController, public auth: AuthProvider,
    public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.GetCategoryList();
  }

  GetCategoryList() {
    let loading = this.auth.loadginFactory();
    this.auth.getCategoryList().subscribe(res => {
      loading.dismiss();
      if (res["status"] == 'success') {
        if (res["data"] != '') {
          this.categoryList = res["data"];
        }
      }
    });
  }

  subcategory(item) {

    // const allComments = this.modal.create(SubcategoryPage);
    // allComments.present();
    // this.navCtrl.push(SubcategoryPage,{CategoryId:categoryId});

    console.log(item)

    if (item["ISsubCategory"] == true) {
      this.navCtrl.push(SubcategoryPage, {
        CategoryId: item["id"]
      });
    }
    else if (item["Isproduct"] == true) {
      this.navCtrl.push(ProductPage, {
        categoryId: item["id"],
        subcategoryId: 0
      });
    }
    else {
      this.presentToast("We don't have any subCategory in this category");
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
    let Searchtext =   ev.target.value;;
    if (Searchtext != "" ) {
      let loading = this.auth.loadginFactory();
      this.auth.getSearchProduct(Searchtext).subscribe(res => {
        loading.dismiss();
        console.log(res);
        if (res["status"] == 'success') {
          if (res["data"] != '') {
            this.searchItem = res["data"];
            if(this.searchItem.length>0){
              this.ShowSearchList=true;
            }
            else{
              this.ShowSearchList=false;
            }
           
          }
          this.searchItem = res["data"];
        }
        else{
          this.searchItem = [];
          this.ShowSearchList=false;
        }
      });
    }
  }
  dataclick(data)
  {
    this.navCtrl.push(ProductDetailPage, {
      productId: data["id"]
    });
  }
}
