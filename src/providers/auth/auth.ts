import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { LoadingController, App, Platform } from 'ionic-angular';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import "rxjs/add/operator/map";
/*
  Generated class for the ProviderAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {

  // Variable Declared in it
  // ApiUrl: string = "http://localhost:8080/adequate/blog/LaravelApi/public/api/";

  ApiUrl: string;
  authUser: object = {};
  rootPage: any;

  constructor(public http: HttpClient,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public app: App,
    public platform: Platform) {
    let env = this;
    // For development
    // this.ApiUrl = "http://localhost:8000/api/mobileapp/";

    // Live Server Link 
    this.ApiUrl = "https://jainhardware.store/laravel_account/api/mobileapp/";
    //  this.PublicUrl = "https://jainhardware.store/";

    this.storage
      .get("guser")
      .then(rt => {
        env.authUser = rt;
      })
      .catch(e => {
        // For Error Log When some Exception Occured
        let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let req = { 'err_text': JSON.stringify(e) + "Line No 58", 'file_path': 'auth.ts', 'method': 'constructor', 'parent_method': "0", 'error_time': date, 'type': 'mobile' }
        this.errorLog(req).subscribe();
      });
  }

  // This code is used for error log on server
  errorLog(values: any) {
    return this.http
      .post(this.ApiUrl + "error_log", values)
      .map((response: any) => {
      });
  }

  // It is colling when user manual login
  doLogin(postData: object) {
    let env = this;
    return new Promise((resolve, reject) => {
      this.http.post(this.ApiUrl + "Userlogin", postData, {}).subscribe(
        data => {
          if (data["status"] == "error") {
            reject(data);
          } else {
            // We are checking wheather user has submitted the all details or not
            if (data["data"].graduation_year == 0 || data["data"].university == 0 || data["data"].is_temp_pass == 1) {
              resolve(data);
            } else {
              env.storage.set("guser", data["data"]);
              env.authUser = data["data"];
              resolve(data);
            }
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }


  // Do Registration Function For Register Users
  doRegistration(res: any): Observable<string> {
    return this.http
      .post(this.ApiUrl + "registration", res)
      .map((response: any) => {
        return <string>response;
      });
  }


  // Loading factory function 
  loadginFactory() {
    let loading = this.loadingCtrl.create({
      //content: 'Please wait...'
    });
    loading.present();
    return loading;
  }


  // Set add to cart product
  public setorderincart(itemId: string, itemeditionId: string, quantity: any) {
    this.getorderincart().then(x => {
      let cartorder = x;
      let addtocartList = [];

      if (cartorder == null) {

        let addtocart = {
          itemId: itemId,
          itemeditionId: itemeditionId,
          quantity: quantity
        }
        addtocartList.push(addtocart);
        this.storage.set("addtocart", addtocartList);
      }
      else {
        let cartList = cartorder;
        // find data exist in the car or not   
        let exist = cartList.find(x => x.itemId == itemId && x.itemeditionId == itemeditionId);
        if (exist != null) {
          if (quantity == "0") {
            console.log(cartList.indexOf(x => x.itemId == itemId && x.itemeditionId == itemeditionId))
            console.log(cartList)
            console.log(itemId)
            console.log(itemeditionId)
            let index = cartList.find(x => x.itemId == itemId && x.itemeditionId == itemeditionId);

            if (index !== null) {
              cartList = cartList.filter(x => x.itemId != itemId && x.itemeditionId != itemeditionId);
            }
          }
          else {
            cartList.forEach(x => {
              if (x.itemId == itemId && x.itemeditionId == itemeditionId) {
                x.quantity = quantity;
              }
            });
          }
        }
        else {

          if (quantity != "0") {
            let addtocart = {
              itemId: itemId,
              itemeditionId: itemeditionId,
              quantity: quantity
            }
            cartList.push(addtocart);
          }
        }

        this.storage.set("addtocart", cartList);
      }
    });

  }

  // Get add to cart product
  public getorderincart() {
    const val = this.storage.get("addtocart");
    return val;
  }

  // set Address Storage
  public SetAddressStorage(address: any, city: any, country: any, postalcode: any, name: any, email, Phone, CompanyName) {
    let Address = {
      address: address,
      city: city,
      country: country,
      postalcode: postalcode,
      name: name,
      email: email,
      Phone: Phone,
      companyName: CompanyName,
    }
    this.storage.set("Address", Address);
  }

  // Get Address Storage
  public getAddressStorage() {
    const val = this.storage.get("Address");
    return val;
  }

  // Get productList
  getproductList(categoryId: any, subcategoryId: any): Observable<any> {
    return this.http.get(this.ApiUrl + "getproductList?category_id=" + categoryId + "&subcategory_id=" + subcategoryId).map((res: any) => {
      return <any>res;
    });
  }


  getCategoryList(): Observable<any> {
    return this.http.get(this.ApiUrl + "getCategoryList").map((res: any) => {
      return <any>res;
    });
  }

  getsubCategoryList(id: any): Observable<any> {
    return this.http.get(this.ApiUrl + "getSubCategoryList?category_id=" + id).map((res: any) => {
      return <any>res;
    });
  }

  getproductDeatil(id: any): Observable<any> {
    return this.http.get(this.ApiUrl + "getproductData?id=" + id).map((res: any) => {
      return <any>res;
    });
  }

  getSearchProduct(test: any): Observable<any> {
    return this.http.get(this.ApiUrl + "getproductSearch?searchText=" + test).map((res: any) => {
      return <any>res;
    });
  }

  getcartDetail(detail: any): Observable<any> {
    let cartList1 = {
      cartlist: detail
    };
    return this.http.post(this.ApiUrl + "getOrderDetail", cartList1).map((res: any) => {
      return <any>res;
    });
  }

  getCouponDetail(test: any): Observable<any> {
    return this.http.get(this.ApiUrl + "couponcodeValid?code=" + test).map((res: any) => {
      return <any>res;
    });
  }

  getAddressList(test: any): Observable<any> {
    return this.http.get(this.ApiUrl + "getAddressList?api_token=" + test).map((res: any) => {
      return <any>res;
    });
  }

  CheckemailExist(test: any): Observable<any> {
    return this.http.get(this.ApiUrl + "CheckEmailExist?email=" + test).map((res: any) => {
      return <any>res;
    });
  }

  SetReserveQuantity(detail: any): Observable<any> {
    let cartList1 = {
      cartlist: detail
    };
    return this.http.post(this.ApiUrl + "SetReserveQuantity", cartList1).map((res: any) => {
      return <any>res;
    });
  }

  Setorderdetail(detail: any): Observable<any> {

    return this.http.post(this.ApiUrl + "placeOrder", detail).map((res: any) => {
      return <any>res;
    });
  }

  GetAddressexit(detail: any): Observable<any> {

    return this.http.get(this.ApiUrl + "CheckAddressExist?api_token=" + detail).map((res: any) => {
      return <any>res;
    });
  }

  ReleaseReserveQuantity(detail: any): Observable<any> {
    let cartList1 = {
      cartlist: detail
    };
    return this.http.post(this.ApiUrl + "RevertReserveQuantity", cartList1).map((res: any) => {
      return <any>res;
    });
  }

  SendEmail(detail: any): Observable<any> {
    return this.http.post(this.ApiUrl + "ContectUsemail", detail).map((res: any) => {
      return <any>res;
    });
  }

  contectInfo(): Observable<any> {
    return this.http.get(this.ApiUrl + "AboutUsInfo").map((res: any) => {
      return <any>res;
    });
  }

  public clear() {

    this.storage.clear().then(() => {
      this.authUser = null;
    });

  }

  // Get Reset Token when user rest the password 
  GetResetToken(RQ: any): Observable<string> {
    return this.http
      .post(this.ApiUrl + "password/email", RQ)
      .map((res: any) => {
        return <string>res["data"];
      })
      .catch((error: any) => {


        return Observable.throw(new Error(error.status));
      });
  }

  // Reset password coll
  ResetPassword(RQ: any): Observable<string> {
    return this.http
      .post(this.ApiUrl + "password/reset", RQ)
      .map((res: any) => {
        return <string>res;
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  // This is for forgot password coll
  forgotPassword(RQ: any): Observable<string> {
    return this.http
      .post(this.ApiUrl + "password/forget", RQ)
      .map((res: any) => {
        return <string>res["data"];
      })
      .catch((error: any) => {
        return Observable.throw(new Error(error.status));
      });
  }

  // Get productList
  getpastOrderList(deciceId: any, Token: any): Observable<any> {
    return this.http.get(this.ApiUrl + "getPastOrder?deviceId=" + deciceId + "&api_token=" + Token).map((res: any) => {
      return <any>res;
    });
  }

  getcompanyLogo(): Observable<any> {
    return this.http.get(this.ApiUrl + "getlogo").map((res: any) => {
      return <any>res;
    });
  }

  // set logo Storage
  public SetlogoStorage(logo: any) {

    this.storage.set("logo", logo);
  }

  // Get logo Storage
  public getlogoStorage() {
    const val = this.storage.get("logo");
    return val;
  }

}
