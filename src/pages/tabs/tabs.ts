import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { CategoryPage } from '../category/category';
import { CartPage } from '../cart/cart';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CategoryPage;
  tab2Root = HomePage;
  tab3Root = ContactPage;
  tab4Root = AboutPage;
  tab5Root = CartPage;

  constructor() {

  }
}
