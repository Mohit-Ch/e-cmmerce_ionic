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
  PostalCode:any;
  PhoneNo1:any;
  PhoneNo2:any;
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
        if(x['data']!=""){
          x['data']['companydetail'].forEach(x => {
            if(x['Key']=='phone1')
            {
              this.PhoneNo1=x['value']
            }
            if(x['Key']=='phone2')
            {
              this.PhoneNo2=x['value']
            }
            if(x['Key']=='address1')
            {
              this.Address=x['value']
            }
            if(x['Key']=='postalcode')
            {
              this.PostalCode=x['value']
            }
            if(x['Key']=='aboutus')
            {
              this.adoutUs=x['value']
            }
          });
        }
      }
    });
  }

  doRefresh(event) {
    let env = this;
    env.getInfoData();
    setTimeout(() => {

      event.complete();
    }, 2000);
  }

}
