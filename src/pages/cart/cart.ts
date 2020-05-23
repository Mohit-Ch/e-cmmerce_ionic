import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, App } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ProductDetailPage } from '../product-detail/product-detail';
import { OrderInfoPage } from '../order-info/order-info';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  searchItem: any = [];
  searchText: any = "";
  name: any = '';
  ShowSearchList: any = false;

  cartdetail: any = [];
  productList: any = [];
  subtotal: any = 0;
  Discount: any = "00.00";
  total: any = 0;
  coupanCode: any;
  coupanShowMessagedeny: any = false;
  coupanShowMessagesuccess: any = false;
  discountdescription: any = "";
  showProcidebutton: any = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public toastCtrl: ToastController, public model: ModalController, public app: App) {
    this.getcartdetail();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');

  }
  ngOnInIt() {
    this.getcartdetail();
  }
  ionViewWillEnter() {
    this.getcartdetail();
  }

  getcartdetail() {
    let loading = this.auth.loadginFactory();
    this.auth.getorderincart().then(cart => {
      if (cart != undefined) {
        this.cartdetail = cart;
        this.subtotal = 0;
        this.productList = [];
        this.auth.getcartDetail(this.cartdetail).subscribe(res => {
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
                  this.subtotal += parseFloat((x["Edition"][0]["price"] * x["OrderQuantity"]).toString());
                  this.total += parseFloat((x["Edition"][0]["price"] * x["OrderQuantity"]).toString());
                }
                x["quantity"] = x["OrderQuantity"];
                if (x["OutOfOrder"] == true) {
                  this.showProcidebutton = false;
                }
              });
            }
            else {
              this.showProcidebutton = false;
            }

          }
          else {
            this.showProcidebutton = false;
          }
        })
      }
      else {
        loading.dismiss();
      }
    });
  }

  Applycouponcode() {
    if (this.coupanCode != undefined) {
      if (this.coupanCode.length == 6) {
        this.auth.getCouponDetail(this.coupanCode).subscribe(res => {
          if (res["code"] == 200) {
            if (res["status"] == 'success') {
              if (res["data"] != '') {

                this.discountdescription = res["data"];
                let minumamount = res["data"]['minOrderAmount'];
                let maxdiscountamoumt = res["data"]['maxDiscountAmount'];
                // let description = res["data"]['description'];
                let type = res["data"][' type '];
                if (this.subtotal > minumamount) {
                  if (type == 'percentage') {
                    let amount = (this.subtotal * res["data"]['amount']) / 100;
                    if (amount <= maxdiscountamoumt) {
                      this.total = this.subtotal - amount;
                    }
                    else {
                      this.total = this.subtotal - maxdiscountamoumt;
                    }
                  }
                  else if (type == 'fixed') {
                    if (res["data"]['amount'] <= maxdiscountamoumt) {
                      this.total = this.subtotal - res["data"]['amount'];
                    }
                    else {
                      this.total = this.subtotal - maxdiscountamoumt;
                    }
                  }
                  this.coupanShowMessagedeny = false;
                  this.coupanShowMessagesuccess = true;
                }
                else {
                  this.coupanShowMessagedeny = true;
                  this.coupanShowMessagesuccess = false;
                }
              }
            }
            else {
              if (res["status"] == 'success') {
                this.coupanShowMessagedeny = true;
                this.coupanShowMessagesuccess = false;
              }
              else {
                this.coupanShowMessagedeny = false;
              }

            }
          }
        })
      }
    }
    else {
      this.coupanShowMessagedeny = false;
      this.coupanShowMessagesuccess = false;
    }
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
  ProductDetail(item) {
    this.navCtrl.push(ProductDetailPage, {
      productId: item
    });
  }

  addtoCartClick(_event: any, item) {
    let _self = this
    if (item['quantity'] <= item['maxquantity']) {
      this.auth.setorderincart(item["id"], item["EditionId"], item["quantity"]);
      setTimeout(function () {
        _self.getcartdetail();
      }, 1000);
    }
    else {
      this.presentToast("This much quantity is not available")
    }
  }

  RemoveToCart(item) {
    let _self = this
    this.auth.setorderincart(item["id"], item["EditionId"], '0');
    setTimeout(function () {      
      _self.getcartdetail();
    }, 1000);
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

  checkout() {
    this.app.getRootNav().setRoot(OrderInfoPage,
      {
        orderDetail: this.productList,
        couponcode: this.coupanCode,
        subtotal: this.subtotal,
        Discount: this.Discount,
        total: this.total
      });
  }

  doRefresh(event) {
    let env = this;
    env.getcartdetail();
    setTimeout(() => {

      event.complete();
    }, 2000);
  }

}
