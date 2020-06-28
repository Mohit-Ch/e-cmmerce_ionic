import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { CategoryPage } from '../category/category';
import { CartPage } from '../cart/cart';
import { AuthProvider } from '../../providers/auth/auth';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CategoryPage;
  tab2Root = HomePage;
  tab3Root = ContactPage;
  tab4Root = AboutPage;
  tab5Root = CartPage;

  countcartShow: any = 0;
  cardnoshow: any;
  constructor(public auth: AuthProvider) {
    this.getlogo();
  }

  ngOnInit() {
    this.cardnoshow = setInterval(() => {
      this.auth.getorderincart().then(x => {
        if (x != undefined)
          this.countcartShow = x.length;
      })
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.cardnoshow);
  }
  doChange($event)
  {
    if($event.id=="t0-0"){
      $event.setRoot($event.root);
    }
    
  }
  getlogo()
  {
    this.auth.getcompanyLogo().subscribe(x=>{
      
      this.auth.SetlogoStorage(x['data']['logo']);
    })
  }

}
