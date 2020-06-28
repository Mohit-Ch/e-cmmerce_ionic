import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, ViewController, Platform, App, ActionSheetController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { ChangePasswordPage } from '../change-password/change-password';
import { LoginModelPage } from '../login-model/login-model';
import { ProductDetailPage } from '../product-detail/product-detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  deviceid:any;
  api_token:any;
  showlogin:any=true;
  productList:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController, public auth: AuthProvider, private alert: AlertController,
    private uniquid: UniqueDeviceID, private platform: Platform,  public app: App, public actionSheetCtrl: ActionSheetController) {

      if (this.auth.authUser != null) {
        this.api_token = this.auth.authUser["api_token"];
        if (this.api_token != null && this.api_token != undefined) {
          this.showlogin = false;
        }
        else {
          this.showlogin = false;
        }
      } else {
        this.showlogin = true;
      }

    if (platform.is('android')) {
      this.uniquid.get()
        .then((uuid: any) => {
         
          this.deviceid = uuid;
        })
        .catch((error: any) => console.log(error));
    } else if(platform.is('ios'))
    {
      this.uniquid.get()
      .then((uuid: any) => {
       
        this.deviceid = uuid;
      })
      .catch((error: any) => console.log(error));

    }
    this.getproductList();
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Change Password',
          handler: () => {
            this.navCtrl.push(ChangePasswordPage, {
            })
          }
        },
        {
          text: 'Log out',
          handler: () => {
            this.logout();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  logout()
  {
    let alert = this.alert.create({
      subTitle: 'Are you sure you want to logout?',
      buttons: [
        {
          text: "No",
        },
        {
          text: "Yes",
          handler: () => {
            this.auth.clear();
           this.showlogin=true;
          }
        }
      ]
    });
    alert.present();
  }

  Login()
  {
    var logindetail = this.modal.create(LoginModelPage);
    logindetail.onDidDismiss(x => {
      if (x["foo"] === "success") {
        this.api_token = x["api_token"]
        if (this.api_token != null && this.api_token != undefined) {
          this.showlogin = false;
        }
      }
    });
    logindetail.present();
  }

  getproductList() {
    let loading = this.auth.loadginFactory();
    let token=this.api_token==undefined?" ":this.api_token;
    this.deviceid= this.deviceid==undefined?' ':this.deviceid;
    this.auth.getpastOrderList(this.deviceid, token).subscribe(res => {
      loading.dismiss();
      if (res["status"] == 'success') {
        if (res["data"] != '') {
          this.productList = res["data"];

          this.productList.forEach(x => {
            if (x["Edition"] != [] && x["Edition"].length > 0) {
              x["price"] = x["price"];
              x["EditionId"] = x["Edition"]["id"];
              x["maxquantity"] = x["Edition"][0]["quantity"];
            }
            x["quantity"] =x["quantity"];
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
}
