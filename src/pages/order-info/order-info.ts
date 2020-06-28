import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, ViewController, Platform, App } from 'ionic-angular';
import { LoginModelPage } from '../login-model/login-model';
import { AuthProvider } from '../../providers/auth/auth';
import { AddressModelPage } from '../address-model/address-model';
import { OrderConformPage } from '../order-conform/order-conform';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the OrderInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-info',
  templateUrl: 'order-info.html',
})
export class OrderInfoPage {

  api_token: any;
  showlogin: any = true;
  address1: any;
  city: any;
  country: any = "Kuwait";
  postalCode: any;
  addressId: any = 0;
  myForm: any;
  name: any;
  Phone: any;
  email: any;
  CompanyName: any;
  AdditionalInfo: any;
  ShowMenditoryData: any = false;
  password: any;
  passwordV: any = false;
  emailvalid: any = false;
  messageEmail: any = "";
  productList: any = [];
  couponcode: any = "";
  subtotal: any;
  Discount: any;
  total: any;
  cartdata: any;
  deviceid: any = "123456";
  existaddress:any=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modal: ModalController, public auth: AuthProvider, private alert: AlertController, private viewCtrl: ViewController,
    private uniquid: UniqueDeviceID, private platform: Platform,  public app: App ) {
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
    this.productList = this.navParams.data["orderDetail"];
    this.couponcode = this.navParams.data["couponcode"];
    this.subtotal = this.navParams.data["subtotal"];
    this.Discount = this.navParams.data["Discount"];
    this.total = this.navParams.data["total"];

    this.auth.getorderincart().then(
      x => {
        this.cartdata = x;
        // this.auth.SetReserveQuantity(this.cartdata).subscribe(x => {

        // })
      }
    )

    if (this.platform.is('android')) {
      this.uniquid.get()
        .then((uuid: any) => {
         
          this.deviceid = uuid;
        })
        .catch((error: any) => console.log(error));
    } else if(this.platform.is('ios'))
    {
      this.uniquid.get()
      .then((uuid: any) => {
       
        this.deviceid = uuid;
      })
      .catch((error: any) => console.log(error));

    }

  }

  ionViewWillEnter() {
    if( this.api_token!=undefined){
      this.auth.GetAddressexit( this.api_token).subscribe(x=>{
        if(x['status']=='success')
        {
          if(x['data']==true)
          {
            this.existaddress=true;
           this.showAddressPopup();
          }
          else{
            this.getaddressforstorage();
          }
        }
      })
    }
    else{
     this.getaddressforstorage();
    }
  }

  ionViewDidLoad() {
  
    
  }

  getaddressforstorage()
  {
    this.auth.getAddressStorage().then(x=>
      {
        if(x!=undefined)
        {
          this.existaddress=true;
          this.showAddressPopup();
        }
        else{
          this.existaddress=false;
        }
      })
  }

  validation() {
    if (this.ShowMenditoryData == true) {
      if (this.password == undefined) {
        return false;
      }
      if (this.email == undefined) {
        return false;
      }
      if (this.password.trim() == "") {
        return false;
      }
      else {
        if (this.password.length < 6) {
          return false;
        }
      }
      if (this.email.trim() == "") {
        return false;
      }
      else {
        if (!this.ValidateEmail(this.email)) {
          return false;
        }
      }

    }

    if (this.name == undefined) {
      return false;
    }
    if (this.name.trim() == "") {
      return false;
    }

    if (this.Phone == undefined) {
      return false;
    }
    if (this.Phone.length < 10) {
      return false;
    }
    if (this.address1 == undefined) {
      return false;
    }
    if (this.address1.trim() == "") {
      return false;
    }
    if (this.city == undefined) {
      return false;
    }
    if (this.city.trim() == "") {
      return false;
    }

    if (this.postalCode == undefined) {
      return false;
    }
    if (this.postalCode.trim() == "") {
      return false;
    }

    return true;

  }



  ValidateEmail(mail) {
    console.log(this.email);
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.email.match(mailformat)) {
      this.emailvalid = false;
      if (this.ShowMenditoryData == true) {
        this.auth.CheckemailExist(this.email).subscribe(
          x => {
            if (x["code"] == 203) {
              this.messageEmail = x["message"];
              this.emailvalid = true;
            }
          }
        )
      }
      return (true)
    }
    this.messageEmail = "Email Formet is not Right";
    this.emailvalid = true;
    return (false)
  }

  checkLengthpass() {
    if (this.password.length < 6) {
      this.passwordV = true;
    }
    else {
      this.passwordV = false;
    }
  }

  login() {
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

  showAddressPopup() {

    var addressModel = this.modal.create(AddressModelPage);
    addressModel.onDidDismiss(x => {
      if (x["foo"] === "success") {
        if (x["type"] == "old") {
          this.address1 = x['address'].address1;
          this.city = x['address'].city;
          this.country = x['address'].country;
          this.postalCode = x['address'].postal_code;
          this.addressId = x['address'].id;
          this.name = x['address'].name;
          this.email = x['address'].email;
          this.Phone = x['address'].phone_no;
          this.CompanyName = x['address'].company_name;
        }
      }
    });
    addressModel.present();
  }

  orderPlaced() {
    let env = this;
    if (!this.validation()) {
      env.presentAlert("Please enter all mandatory (*) field!");
      return;
    }

    this.auth.SetAddressStorage(this.address1, this.city, this.country, this.postalCode,this.name,this.email,this.Phone,this.CompanyName);
    let detail = {
      name: this.name,
      email: this.email == undefined ? "" : this.email,
      Phone: this.Phone,
      password: this.password == undefined ? "" : this.password,
      companyName: this.CompanyName == undefined ? "" : this.CompanyName,
      createLogin: this.ShowMenditoryData,
      address1: this.address1 == undefined ? "" : this.address1,
      city: this.city == undefined ? "" : this.city,
      country: this.country == undefined ? "" : this.country,
      postal_code: this.postalCode == undefined ? "" : this.postalCode,
      AdditionalInfo: this.AdditionalInfo == undefined ? "" : this.AdditionalInfo,
      couponcode: this.couponcode == undefined ? "" : this.couponcode,
      cartList: this.cartdata,
      api_token: this.api_token == undefined ? "" : this.api_token,
      addressId: this.addressId,
      total: this.total,
      subtotal: this.subtotal,
      discount: this.Discount == undefined ? 0 : this.Discount,
      deviceId: this.deviceid

    }
    
    let Loader = this.auth.loadginFactory();
    this.auth.Setorderdetail(detail).subscribe(x => {
      Loader.dismiss();
      if (x["code"] ==200) {
        this.cartdata.forEach(y => {
          this.auth.setorderincart(y['itemId'], y['itemeditionId'], 0);
        });
        this.app.getRootNav().setRoot(TabsPage);
        this.navCtrl.push(OrderConformPage, {
          orderId: x["orderId"],
          status: "success"
        })
        // let data = { foo: "bar" };
        // this.viewCtrl.dismiss(data);
      } else if(x["code"] ==205){
        this.presentAletNav(x["message"])
      }
      else if(x["code"] ==206){
        this.presentAlert(x["message"])
      } else {
        this.app.getRootNav().setRoot(TabsPage);
        this.navCtrl.push(OrderConformPage, {
          status: "error"
        })
      }
    })
  }

  // Alert any Error occured 
  presentAlert(error: any) {
    let alert = this.alert.create({
      subTitle: error,
      buttons: ["Ok"]
    });
    alert.present();
  }

  backbutton()
  {
    this.app.getRootNav().setRoot(TabsPage);
    // this.auth.getorderincart().then(
    //   x => {
    //     this.cartdata = x;
    //     this.auth.ReleaseReserveQuantity(this.cartdata).subscribe(x => {
    //       this.app.getRootNav().setRoot(TabsPage);
    //     })
    //   }
    // )
  }

   // Alert any Error occured 
   presentAletNav(error: any) {
    let alert = this.alert.create({
      subTitle: error,
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.app.getRootNav().setRoot(TabsPage);
        }}]
    });
    alert.present();
  }
}
