import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ViewController } from 'ionic-angular';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the LoginModelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login-model',
  templateUrl: 'login-model.html',
})
export class LoginModelPage {

   // Variable Declared in it
   myForm: any;
   userData: any;
   DeviceId: string;
   submitt: boolean = false;
   Toast:any;
   
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    private auth: AuthProvider,
    private alert: AlertController,
    private viewCtrl:ViewController) {
    this.initializeForm();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginModelPage');
  }

   // InitiallizeFrom validation and through form Builder
   private initializeForm() {

    //  Set From Validation
    this.myForm = this.formBuilder.group({
      password: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10)
        ])
      ),
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      )
    });
  }

  // Function for manual Login
  login() {
    let env = this;

    // Check form validation 
    if (this.myForm.valid) {

      // Set Device token In it 
      this.myForm.value["device_token"] = this.DeviceId

      // Coll do login in auth.ts function
      this.auth
        .doLogin(this.myForm.value)
        .then(
          res => {
            console.log(res);
            // Check Id And set MixPanel people Property
            if (res['data'].id != null && res["data"].name != null) {
              let data = { foo: "success",
              api_token: res["data"].api_token
             };
              this.viewCtrl.dismiss(data);
              
            }
          },
          error => {
            if (error == "Login Email or Password are incorrect") {
              env.presentAlert(error);
            } else if (error == "Unable to login to your account") {
              env.presentAlert(error);
            }
            else {
              env.presentAlert("Something went wrong");
            }

            // Set Error In Error Log Table
            let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            let req = { 'err_text': JSON.stringify(error) + "Line No 95", 'file_path': 'login.ts', 'method': 'login', 'parent_method': "0", 'error_time': date, 'type': 'mobile' }
            this.auth.errorLog(req).subscribe();
          }
        )
        .catch(e => {
          // In case Of Exception
          let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
          let req = { 'err_text': JSON.stringify(e) + "Line No 102", 'file_path': 'login.ts', 'method': 'login', 'parent_method': "0", 'error_time': date, 'type': 'mobile' }
          this.auth.errorLog(req).subscribe();
          env.presentAlert("Something went wrong");
        });
    }
    else {
      // when error on form show
      this.submitt = true;
    }
  }

   // Alert any Error occured 
   presentAlert(error: any) {
    let alert = this.alert.create({
      subTitle: error,
      buttons: ["Ok"]
    });
    alert.present();
  }

  dismiss() {
    let data = { foo: "bar" };
    this.viewCtrl.dismiss(data);
  }


}
