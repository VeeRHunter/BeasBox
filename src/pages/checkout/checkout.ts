import { Component, ViewChild } from '@angular/core';

import { IonicPage, NavController, NavParams, Select, Checkbox, AlertController, LoadingController } from 'ionic-angular';
import { DataService } from '../../app/shared/services/data.service';
import { UserAuthService } from '../../app/shared/services/user-auth.service';
import { UPSService } from '../../app/shared/services/ups.service';
import { WooCommerceService } from '../../app/shared/services/woocommerce.service';

import { AppUser } from '../../app/shared/models/app-user.model';
import { Billing } from '../../app/shared/models/billing.model';
import { Shipping } from '../../app/shared/models/shipping.model';
import { Checkout, ShippingLine, LineItem } from '../../app/shared/models/order.model';
import { Storage } from '@ionic/storage';

import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Cart } from '../../app/shared/models/cart.model';
import { states } from '../../app/shared/models/states.model';
import { SimplePlaceholderMapper } from '../../../node_modules/@angular/compiler/src/i18n/serializers/serializer';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';

var self

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  user: firebase.User;
  appUser: AppUser;
  cart: Cart;
  subTotal: number = 0;
  taxStatus: string = 'taxable';  // Default    'taxable', 'shipping', 'none'
  taxClass: string = '';            // 'Standard', ''
  weight: number = 0;
  shippingFee: number = 0;
  handle: number = 6;
  taxable: number = 0;
  tax: number = 0;
  total: number = 0;

  stateList = states;

  billingAddress: Billing = {
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "United States(US)",
    email: "",
    phone: "",
  };
  @ViewChild('shipToDifferent') shipToDifferent: Checkbox;
  @ViewChild('selectAddr') selectAddr: Select;
  @ViewChild('wantSave') wantSave: Checkbox;
  shippingAddresses: Array<Shipping> = [];
  taxRates: Array<any> = [];

  loader = this.loadingCtrl.create({ content: 'Calculating Shipping Rates ...' });
  shippingAddrChanged = false;
  err_ups: string = "Enter your full address to see  shipping costs"

  ups_fees = {
    ground: 40.91,
    day3_select: 63.92,
    day2_air: 81.77
  }

  order_form: FormGroup = new FormGroup({});
  billing_group: FormGroup;
  shipping_group: FormGroup;

  checkout: Checkout = {
    payment_method: 'paypal',
    payment_method_title: 'PayPal',
    set_paid: true,
    billing: null,
    shipping: null,
    line_items: [],
    shipping_lines: []
  };

  /**
   billing
   {
      first_name: 'John',
      last_name: 'Doe',
      address_1: '969 Market',
      address_2: '',
      city: 'San Francisco',
      state: 'CA',
      postcode: '94103',
      country: 'US',
      email: 'john.doe@example.com',
      phone: '(555) 555-5555'
    },
    shipping
    {
      first_name: 'John',
      last_name: 'Doe',
      address_1: '969 Market',
      address_2: '',
      city: 'San Francisco',
      state: 'CA',
      postcode: '94103',
      country: 'US'
    },
    line_items
    [
      {
        product_id: 93,
        quantity: 2
      },
      {
        product_id: 22,
        variation_id: 23,
        quantity: 1
      }
    ],
    shipping_lines
    [
      {
        method_id: 'flat_rate',
        method_title: 'Flat Rate',
        total: 10
      }
    ]
   */

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private dataService: DataService,
    private authService: UserAuthService,
    public formBuilder: FormBuilder,
    public storage: Storage,
    private wooService: WooCommerceService,
    private upsService: UPSService,
    private payPal: PayPal,
    public navParams: NavParams) {
    this.cart = this.navParams.get('cart');
    console.log(this.cart)
  }

  async ionViewWillEnter() {
    console.log("b")
    this.authService.getAuthenticatedUser().subscribe((user: firebase.User) => this.user = user);
    this.authService.appUser$.subscribe((user) => {
      this.appUser = user
      console.log(this.user);
      if (!user) return;

      this.order_form.get("email").setValue(this.appUser.email)
      if (this.appUser.billingAddress) {
        this.order_form.get("billing_group").get("first_name").setValue(this.appUser.billingAddress.first_name)
        this.order_form.get("billing_group").get("last_name").setValue(this.appUser.billingAddress.last_name)
        this.order_form.get("billing_group").get("phone").setValue(this.appUser.billingAddress.phone)
        this.order_form.get("billing_group").get("shipToDifferent").setValue(false)
      } else {
        this.order_form.get("billing_group").get("shipToDifferent").setValue(true)
      }

      if (this.appUser.shippingAddresses && this.appUser.shippingAddresses.length > 0) {
        this.shippingAddresses = this.appUser.shippingAddresses
      }
      // select "New Address" in Shipping Address
      this.order_form.get("prevAddressIndex").setValue(this.shippingAddresses.length)
      this.toggleValidators()
    });

    this.taxRates = await this.wooService.getAllTaxRates();
    console.log(this.taxRates)

    this.subTotal = 0;
    this.weight = 0;
    this.cart.items.forEach(item => {
      this.subTotal += item.quantity * parseFloat(item.product.price);
      this.weight += item.quantity * parseFloat(item.product.weight);
      switch (item.product.tax_status) {
        case 'taxable':
          this.taxable += item.quantity * parseFloat(item.product.price);
          break;
        case 'shipping':
          break;
        case 'none':
          break;
      }
    })
    this.taxable += this.handle + this.shippingFee
    this.total = this.subTotal + this.handle + this.shippingFee + this.tax;
    this.tax = 0;
    this.order_form.get("subtotal").setValue(this.subTotal)
    this.order_form.get("shipping_fee").setValue(this.shippingFee)
    this.order_form.get("handle").setValue(this.handle)
    this.order_form.get("tax").setValue(this.tax)
    this.order_form.get("total").setValue(this.total)

    setTimeout(async () => {
      console.log(this.order_form.value)
      this.shippingAddrChanged = true;
    }, 2000)
  }

  ionViewWillLoad() {
    this.initForm();
  }

  initForm() {
    this.billing_group = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      shipToDifferent: new FormControl(false),
    });

    this.shipping_group = new FormGroup({
      company_name: new FormControl("", Validators.required),
      country: new FormControl('United States(US)', Validators.required),
      address_1: new FormControl('', Validators.required),
      address_2: new FormControl(''),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      postcode: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      wantSave: new FormControl(false)
    });

    this.order_form = new FormGroup({
      // order_key: new FormControl(),
      // order_number: new FormControl(),
      // cusotomer_id: new FormControl(this.appUser.id),
      email: new FormControl('', Validators.required),

      billing_group: this.billing_group,
      shipping_group: this.shipping_group,
      prevAddressIndex: new FormControl(-1),
      order_notes: new FormControl('', Validators.required),

      ups: new FormControl(this.ups_fees.ground),
      subtotal: new FormControl(0),
      // shipping_method: new FormControl(),
      shipping_fee: new FormControl(0),
      handle: new FormControl(0),
      tax: new FormControl(0),
      total: new FormControl(0),
      coupon: new FormControl('')

      // created_at: new FormControl(),
      // updated_at: new FormControl(),
    });
    self = this
    this.order_form.get("shipping_group").valueChanges.subscribe(this.handlerAddrChange);
  }

  toggleValidators() {
    if (this.shipToDifferent.checked) {
      this.order_form.get("shipping_group").get("company_name").setValidators(Validators.required);
      this.order_form.get("shipping_group").get("country").setValidators(Validators.required);
      this.order_form.get("shipping_group").get("address_1").setValidators(Validators.required);
      this.order_form.get("shipping_group").get("city").setValidators(Validators.required);
      this.order_form.get("shipping_group").get("state").setValidators(Validators.required);
      this.order_form.get("shipping_group").get("postcode").setValidators(Validators.required);
      this.order_form.get("shipping_group").get("phone").setValidators(Validators.required);
    } else {
      this.order_form.get("shipping_group").get("company_name").clearValidators();
      this.order_form.get("shipping_group").get("country").clearValidators();
      this.order_form.get("shipping_group").get("address_1").clearValidators();
      this.order_form.get("shipping_group").get("city").clearValidators();
      this.order_form.get("shipping_group").get("state").clearValidators();
      this.order_form.get("shipping_group").get("postcode").clearValidators();
      this.order_form.get("shipping_group").get("phone").clearValidators();
    }
    this.order_form.get("shipping_group").get("company_name").updateValueAndValidity();
    this.order_form.get("shipping_group").get("country").updateValueAndValidity();
    this.order_form.get("shipping_group").get("address_1").updateValueAndValidity();
    this.order_form.get("shipping_group").get("city").updateValueAndValidity();
    this.order_form.get("shipping_group").get("state").updateValueAndValidity();
    this.order_form.get("shipping_group").get("postcode").updateValueAndValidity();
    this.order_form.get("shipping_group").get("phone").updateValueAndValidity();
  }

  selectPrevShippingAddr() {
    let i = this.selectAddr.value
    // this.order_form.get("shipping_group").get("first_name").setValue(this.shippingAddresses[i].first_name)
    // this.order_form.get("shipping_group").get("last_name").setValue(this.shippingAddresses[i].last_name)
    if (this.shippingAddresses.length > i) {
      this.order_form.get("shipping_group").setValue({
        phone: this.shippingAddresses[i].phone || '',
        company_name: this.shippingAddresses[i].company_name || '',
        address_1: this.shippingAddresses[i].address_1 || '',
        address_2: this.shippingAddresses[i].address_2 || '',
        city: this.shippingAddresses[i].city || '',
        state: this.shippingAddresses[i].state || '',
        postcode: this.shippingAddresses[i].postcode || '',
        country: this.shippingAddresses[i].country || 'United States(US)',
        wantSave: false
      })
    } else {
      this.order_form.get("shipping_group").setValue({
        phone: '',
        company_name: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        postcode: '',
        country: 'United States(US)',
        wantSave: false
      })
    }
  }

  handlerAddrChange(res) {
    // if(self.order_form.get("shipping_group").get("country").value == res.country &&
    // self.order_form.get("shipping_group").get("state").value == res.state &&
    // self.order_form.get("shipping_group").get("city").value == res.city &&
    // self.order_form.get("shipping_group").get("postcode").value == res.postcode &&
    // self.order_form.get("shipping_group").get("address_1").value == res.address_1)  return;

    if (self.order_form.get("billing_group").get("shipToDifferent").value == true) {
      if (self.order_form.get("shipping_group").get("country").value.trim().length > 0 &&
        self.order_form.get("shipping_group").get("city").value.trim().length > 0 &&
        self.order_form.get("shipping_group").get("postcode").value.trim().length > 0) {
        self.shippingAddrChanged = true;
      } else {
        self.shippingAddrChanged = true;
        self.err_ups = "Enter your full address to see  shipping costs"
      }
    } else {
      self.shippingAddrChanged = true;
    }
  }

  async updateShippingRates() {
    let country, state, city, postcode, address
    if (this.shipToDifferent.checked) {
      country = this.order_form.get('shipping_group').get('country').value
      state = this.order_form.get('shipping_group').get('state').value
      city = this.order_form.get('shipping_group').get('city').value
      postcode = this.order_form.get('shipping_group').get('postcode').value
      address = this.order_form.get('shipping_group').get('address_1').value
    } else {
      country = this.appUser.billingAddress.country
      state = this.appUser.billingAddress.state
      city = this.appUser.billingAddress.city
      postcode = this.appUser.billingAddress.postcode
      address = this.appUser.billingAddress.address_1
    }

    if (country == 'United States(US)') {
      country = 'US'
      let ss = this.stateList.find(s => s.name == state)
      if (ss != null) state = ss.code

      // if(this.loader == null) {
      //   this.loadingCtrl.create({ content: 'Calculating Shipping Rates ...' });
      //   this.loader.present();
      // } 
      let res = await this.upsService.post({
        name: this.appUser.name,
        country: country,
        state: state,
        city: city,
        postcode: postcode,
        address: address,
        weight: this.weight
      })
      // if(this.loader == null) {
      //   this.loader.dismiss(); this.loader = null
      // }

      console.log(res)
      if (res.err == null) {
        this.shippingAddrChanged = false;
        this.ups_fees = res.rates
        this.order_form.get("ups").setValue(this.ups_fees.ground)
        this.calcShipping()
      } else {
        this.err_ups = res.err
      }
    } else {
      this.shippingAddrChanged = false;
      this.err_ups = "The requested service is unavailable between the selected locations"
    }
  }

  async calcShipping() {
    let country, state, city, postcode, address
    if (this.shipToDifferent.checked) {
      country = this.order_form.get('shipping_group').get('country').value
      state = this.order_form.get('shipping_group').get('state').value
      city = this.order_form.get('shipping_group').get('city').value
      postcode = this.order_form.get('shipping_group').get('postcode').value
      address = this.order_form.get('shipping_group').get('address_1').value
    } else {
      country = this.appUser.billingAddress.country
      state = this.appUser.billingAddress.state
      city = this.appUser.billingAddress.city
      postcode = this.appUser.billingAddress.postcode
      address = this.appUser.billingAddress.address_1
    }

    if (country == 'United States(US)') {
      country = 'US'
      let ss = this.stateList.find(s => s.name == state)
      if (ss != null) state = ss.code

      let rate = 0;
      for (let i = 0; i < this.taxRates.length; i++) {
        const r = this.taxRates[i];
        if (r.country === country && r.state === state) {
          rate = parseFloat(r.rate);
          break;
        }
      }

      this.shippingFee = parseFloat(this.order_form.get("ups").value)
      this.order_form.get("shipping_fee").setValue(this.shippingFee)
      if (!this.shippingAddrChanged) {
        this.taxable = this.subTotal + this.handle + this.shippingFee
      } else {
        this.taxable = this.subTotal + this.handle
      }

      this.tax = this.taxable * rate / 100;
      this.total = this.taxable + this.tax;
      this.order_form.get("tax").setValue(this.tax)
      this.order_form.get("total").setValue(this.total)
    }

  }

  presentCouponPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Enter Your Code',
      inputs: [
        {
          name: 'coupon',
          placeholder: 'Coupon Code',
          type: 'text',
          value: this.order_form.get("coupon").value.coupon as string
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: data => {
            this.order_form.get("coupon").setValue(data)
          }
        }
      ]
    });
    alert.present();
  }

  checkOrder() {
    console.log(this.order_form)
  }

  goToLogin() {
    this.navCtrl.setRoot("LoginPage")
  }

  goBack() {
    this.navCtrl.pop();
  }

  selectUPS(ups_fee) {
    this.calcShipping()
  }

  async proceedToPaypal() {
    if (this.shippingAddrChanged) {
      let alert = this.alertCtrl.create({
        subTitle: 'Please update shipping rates',
        buttons: ['Dismiss']
      });
      alert.present();
      return;
    }

    this.calcShipping()
    if (!this.order_form.valid) {
      return;
    }
    this.dataService.placeOrder(this.order_form.value);
    if (this.shipToDifferent.checked) {
      if (this.wantSave.checked) {
        if (this.appUser.shippingAddresses && this.appUser.shippingAddresses.length > 0)
          this.appUser.shippingAddresses.push(this.order_form.get("shipping_group").value as Shipping);
        else
          this.appUser.shippingAddresses = [this.order_form.get("shipping_group").value as Shipping];

        await this.dataService.saveAppUser(this.user, this.appUser)
      }
    }
    await this.placeOrder()
  }

  async placeOrder() {
    let billing = this.appUser.billingAddress; billing.email = this.appUser.email;
    let shipping;
    if (this.shipToDifferent.checked) {
      shipping = this.order_form.get('shipping_group').value;
    } else {
      shipping = {
        first_name: this.appUser.billingAddress.first_name,
        last_name: this.appUser.billingAddress.last_name,
        address_1: this.appUser.billingAddress.address_1,
        address_2: this.appUser.billingAddress.address_2,
        city: this.appUser.billingAddress.city,
        state: this.appUser.billingAddress.state,
        postcode: this.appUser.billingAddress.postcode,
        country: this.appUser.billingAddress.country,
        phone: this.billingAddress.phone,
        company_name: ''
      } as Shipping;
    }

    let line_items = []
    for (let i = 0; i < this.cart.items.length; i++) {
      const item = this.cart.items[i];
      line_items.push({
        product_id: item.product.id,
        // variation_id: item.product.variations
        quantity: item.quantity,
      })
    }

    this.checkout = {
      payment_method: 'paypal',
      payment_method_title: 'PayPal',
      set_paid: false,
      billing: billing,
      shipping: shipping,
      line_items: line_items,
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Flat Rate',
          total: '6'
        }
      ]
    };

    await this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AZRwj6pxWRERcaBoXl7Y3yND80mXCEhx05gCSZufkx0Wreg16oHFdgnLoQNaJ7x_y2RLLXgiiCR6zNKy'
    });

    // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
    await this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
      // Only needed if you get an "Internal Service Error" after PayPal login!
      //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
    }));

    let payment = new PayPalPayment(this.total.toString(), 'USD', 'Description', 'sale');
    console.log(payment)
    // Example sandbox response
    // {
    //   "client": {
    //     "environment": "sandbox",
    //     "product_name": "PayPal iOS SDK",
    //     "paypal_sdk_version": "2.16.0",
    //     "platform": "iOS"
    //   },
    //   "response_type": "payment",
    //   "response": {
    //     "id": "PAY-1AB23456CD789012EF34GHIJ",
    //     "state": "approved",
    //     "create_time": "2016-10-03T13:33:33Z",
    //     "intent": "sale"
    //   }
    // }
    try {
      let response = await this.payPal.renderSinglePaymentUI(payment)
      console.log(response)

      await this.wooService.placeOrder(this.checkout)
      // alert("Order placed successfully !");
      this.alertCtrl.create({
        subTitle: "Order Placed Successfully",
        buttons: [{
          text: "OK",
          handler: () => { }
        }]
      }).present();
      await this.storage.remove("cart");
      this.navCtrl.pop();
    } catch (err) {
      // alert("Failed!");
      console.log(err)
      this.alertCtrl.create({
        subTitle: "Payment Cancelled or Failed!",
        buttons: [{
          text: "OK",
          handler: () => { }
        }]
      }).present();
      // await this.storage.remove("cart");
      this.navCtrl.pop();
    }
  }
}
