import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  adoutUs:any;
  Address:any;
  PhoneNo:any;
  constructor(public navCtrl: NavController, public auth:AuthProvider) {

  }
  ionViewDidLoad() {
    this.getInfoData();
  }

  getInfoData()
  {
    this.auth.contectInfo().subscribe(x=>{
      if(x['status']=='success')
      {
        if(x['data']['address']!="")
        this.Address=x['data']['address']['address1'] +" "+ x['data']['address']['city'] +" "+ x['data']['address']['country'];
        else
        this.Address=" 123 shop no, location, area, city , state";

        this.adoutUs=x['data']['about_us'];
        this.PhoneNo=x['data']['phone_no'];
      }
    });
  }
}
