import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  myForm: any;
  api_token: string;
  user_Id: string;
  email: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider,
    public formBuilder: FormBuilder,
    private alert: AlertController) {
      this.api_token = this.auth.authUser["api_token"];
      this.user_Id = this.auth.authUser["id"];
      this.email = this.auth.authUser["email"];
      this.formvalidation();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  formvalidation()
  {
     // Declare form validation 
     this.myForm = this.formBuilder.group(
      {
        currentPassword: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(15)
          ])
        ),
        password: new FormControl(
          "",
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(15)
          ])
        ),
        cnfpassword: new FormControl(
          "",
          Validators.compose([Validators.required])
        )
      },
      { validator: this.passwordConfirming }
    );

  }

   // Password confirimg click
   passwordConfirming(c: AbstractControl): { Passinvalid: boolean } {
    if (c.get("password").value !== c.get("cnfpassword").value) {
      return { Passinvalid: true };
    }
  }

  //  Present Alert click
  presentAlert(error) {
    let alert = this.alert.create({
      //title: "Message",
      subTitle: error,
      buttons: ["Ok"]
    });
    alert.present();
  }

   //  Change password click
   changePassword() {
    if (this.myForm.valid) {
      if (this.myForm.value.currentPassword == this.myForm.value.password) {
        this.presentAlert("Old Password and new password could not be same.");
        return;
      }
      let RQ: any = {
        email: this.email
      };
      this.auth.GetResetToken(RQ).subscribe(res => {
        if (res["token"] != undefined) {
          let ResetRQ: any = {
            currentpassword: this.myForm.value.currentPassword,
            password: this.myForm.value.password,
            password_confirmation: this.myForm.value.cnfpassword,
            id: this.user_Id,
            token: res["token"],
            email: this.email
          }
          this.auth.ResetPassword(ResetRQ).subscribe(resP => {
            this.presentAlert(resP["message"]);
          });
        }
      })
    }
  }

}
