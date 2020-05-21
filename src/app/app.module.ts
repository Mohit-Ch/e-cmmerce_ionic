import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoryPage } from '../pages/category/category';
import { SubcategoryPage } from '../pages/subcategory/subcategory';
import { ProductPage } from '../pages/product/product';
import { ProductDetailPage } from '../pages/product-detail/product-detail';
import { EmailPage } from '../pages/email/email';
import { CartPage } from '../pages/cart/cart';
import { AuthProvider } from '../providers/auth/auth';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { OrderInfoPage } from '../pages/order-info/order-info';
import { LoginModelPage } from '../pages/login-model/login-model';
import { OrderConformPage } from '../pages/order-conform/order-conform';
import { AddressModelPage } from '../pages/address-model/address-model';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    CategoryPage,
    SubcategoryPage,
    ProductPage,
    ProductDetailPage,
    EmailPage,
    CartPage,
    OrderInfoPage,
    LoginModelPage,
    OrderConformPage,
    AddressModelPage
  ],
  imports: [
    BrowserModule,
    CommonModule ,
    IonicModule.forRoot(MyApp),    
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    CategoryPage,
    SubcategoryPage,
    ProductPage,
    ProductDetailPage,
    EmailPage,
    CartPage,
    OrderInfoPage,
    LoginModelPage,
    OrderConformPage,
    AddressModelPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    UniqueDeviceID
  ]
})
export class AppModule {}
