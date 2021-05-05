import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ProductDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  productId:any=0;
  productdata:any;
  itemedition:any=[];
  itemImage:any=[];
  itemInfo:any=[];
  remark:any="";
  constructor(public navCtrl: NavController, public navParams: NavParams,public auth: AuthProvider) {
    this.productId=this.navParams.data["productId"];
    this.getProductDetail();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
  }

  getProductDetail(){
    if(this.productId!=0)
    {
      let loading = this.auth.loadginFactory();
      this.auth.getproductDeatil(this.productId).subscribe(res=>{
        loading.dismiss();
        if(res["status"]=='success')
        { 
          if(res["data"]!='')
          {
           this.productdata=res["data"]["itemDetail"];
           this.itemedition=res["data"]["itemedition"];
           this.itemImage=res["data"]["itemImage"];
           this.itemInfo=res["data"]["itemInfo"];
           if( this.productdata!=undefined)
           {
            this.productdata["ShowAddbutton"]=false;
            this.productdata["maxquantity"]=1;
             if(this.itemedition!=[] && this.itemedition.length>0){
              this.productdata["price"]= this.itemedition[0]["price"];
              if(this.itemedition[0].quantity>0)
              {
                this.productdata["ShowAddbutton"]=true;
              }
              else 
              {
                this.productdata["ShowAddbutton"]=false;
              }
              this.productdata["EditionId"]=this.itemedition[0]["id"];
              this.productdata["maxquantity"]=this.itemedition[0]["quantity"];
              this.remark=this.itemedition[0]["remark"];
             }
             this.productdata["quantity"]=1;
           }
          }
        }
      });
    }
  }

  addtoCartClick(item:any)
  {
    this.auth.setorderincart(this.productdata["id"], this.productdata["EditionId"], this.productdata["quantity"]);
  }
  datachange()
  {

    if(this.productdata!=undefined)
    {
     if(  this.itemedition.length>0)
     {
      this.itemedition.forEach(x => {
        if(x["id"]==this.productdata["EditionId"])
        {
          this.productdata["price"]=x["price"];
          this.productdata["quantity"]=1;
          this.remark=x["remark"];
          let itemQuantity =+ x["quantity"];
         
            if(itemQuantity>0)
            {
              this.productdata["ShowAddbutton"]=true;
            }
            else{
              this.productdata["ShowAddbutton"]=false;
            }
        }
        
      });
     }
     
    }
  }

  incrementQty(data){
    if(data.quantity< data.maxquantity)
    {
      data.quantity += 1;
      console.log(data.quantity + 1);
    }
    
    }
    
    //decrements item
    
    decrementQty(data){
    if(data.quantity-1 < 1){
      data.quantity = 1;
      console.log('item_1->' + data.quantity)
    }
    else{
      data.quantity -= 1;
      console.log('item_2->' + data.quantity);
    }
    }


}
