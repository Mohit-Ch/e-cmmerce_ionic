import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  myForm: any;
  submitt:boolean=false;
  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,public auth: AuthProvider,
    public toastCtrl: ToastController) {
    this.formvalidation();
  }

  formvalidation()
  {
    // Check Form Validation
    this.myForm = this.formBuilder.group(
      {
        Name: new FormControl("",Validators.compose([Validators.required])),
        Email: new FormControl("",
        Validators.compose([Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])),
        Phone: new FormControl("",Validators.compose([Validators.required, Validators.pattern('^(0|[1-9][0-9]*)$')])),
        Message: new FormControl("",Validators.compose([Validators.required])),
      }
    );
  }

  savedata()
  {
    this.submitt=true;    
    if(this.myForm.valid)
    {
      this.submitt=false;

      let Email={
       
        Name :this.myForm.get("Name").value,
        Email :this.myForm.get("Email").value,
        Phone :this.myForm.get("Phone").value,
        Message :this.myForm.get("Message").value,
        
      };
     
      this.auth.SendEmail(Email).subscribe(x=>{
        if(x["status"]=="success")
        {
          this.myForm.controls.Name.setValue("");
          this.myForm.controls.Email.setValue("");
          this.myForm.controls.Phone.setValue("");
          this.myForm.controls.Message.setValue("");        
          this.presentToast("You enquary send to the company please wait for the reply in your mail.");
        }
      });
    }
    else{
      this.submitt=true;
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

}
