import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  myForm: any;
  passwordsent: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public auth: AuthProvider,
    private alert: AlertController,
    private viewCtrl: ViewController) {
      this.initializeForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  // Forgot password Button 
  forgotpassword() {
    let RQ: any = {
      email: this.myForm.value.email
    }
    let loading = this.auth.loadginFactory();
    this.auth.forgotPassword(RQ).subscribe(res => {
      loading.dismiss();
      this.passwordsent = true;
      this.successAlert("An email with password reset instructions has been sent to your email address, if it exists on our system.");
    },
      error => {
        loading.dismiss();
        this.passwordsent = true;
        this.successAlert("An email with password reset instructions has been sent to your email address, if it exists on our system.");
      });

  }
  //  Form validation click
  private initializeForm() {
    this.myForm = this.formBuilder.group({
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      )
    });
  }

  // Alert Box 
  presentAlert(error) {
    let alert = this.alert.create({
      subTitle: error,
      buttons: ["Ok"]
    });
    alert.present();
  }

  // At Success Alert Message
  private successAlert(msg) {
    let env = this;
    let alert = this.alert.create({
      enableBackdropDismiss: false,
      subTitle: msg,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            env.dismiss();
          }
        }
      ]
    });
    alert.present();
  }

  dismiss() {
    let data = { foo: "bar" };
    this.viewCtrl.dismiss(data);
  }


}
