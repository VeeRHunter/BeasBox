import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController, Loading, Alert, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
/**
 * Api is a generic REST Api handler. Set your API endpoint first.
 */

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'text/xml' })
};   

@Injectable()
export class UPSService {

    endpoint: string = 'https://wwwcie.ups.com/rest/Rate';  

	private $pickup_code = {
		'01' : "Daily Pickup",
		'03' : "Customer Counter",
		'06' : "One Time Pickup",
		'07' : "On Call Air",
		'19' : "Letter Center",
		'20' : "Air Service Center",
    };
    private $customer_classification_code = {
		'NA' : "Default",
		'00' : "Rates Associated with Shipper Number",
		'01' : "Daily Rates",
		'04' : "Retail Rates",
		'05' : "Regional Rates",
		'06' : "General List Rates",
		'53' : "Standard List Rates",
    }
	private $services = {
		// Domestic
		"12" : "3 Day Select",
		"03" : "Ground",
		"02" : "2nd Day Air",
		"59" : "2nd Day Air AM",
		"01" : "Next Day Air",
		"13" : "Next Day Air Saver",
		"14" : "Next Day Air Early AM",

		// International
		"11" : "Standard",
		"07" : "Worldwide Express",
		"54" : "Worldwide Express Plus",
		"08" : "Worldwide Expedited",
		"65" : "Saver",
		
		// SurePost
		"92" :	"SurePost Less than 1 lb",
		"93" :	"SurePost 1 lb or Greater",
		"94" :	"SurePost BPM",
		"95" :	"SurePost Media",
    };
	private $eu_array = ['BE','BG','CZ','DK','DE','EE','IE','GR','ES','FR','HR','IT','CY','LV','LT','LU','HU','MT','NL','AT','PT','RO','SI','SK','FI','GB'];
    private $no_postcode_country_array = ['AE','AF','AG','AI','AL','AN','AO','AW','BB','BF','BH','BI','BJ','BM','BO','BS','BT','BW','BZ','CD','CF','CG','CI','CK','CL','CM','CO','CR','CV','DJ','DM','DO','EC','EG','ER','ET','FJ','FK','GA','GD','GH','GI','GM','GN','GQ','GT','GW','GY','HK','HN','HT','IE','IQ','IR','JM','JO','KE','KH','KI','KM','KN','KP','KW','KY','LA','LB','LC','LK','LR','LS','LY','ML','MM','MO','MR','MS','MT','MU','MW','MZ','NA','NE','NG','NI','NP','NR','NU','OM','PA','PE','PF','PY','QA','RW','SA','SB','SC','SD','SL','SN','SO','SR','SS','ST','SV','SY','TC','TD','TG','TL','TO','TT','TV','TZ','UG','UY','VC','VE','VG','VN','VU','WS','XA','XB','XC','XE','XL','XM','XN','XS','YE','ZM','ZW'];
	
	// Shipments Originating in the European Union
	private $euservices = {
		"07" : "UPS Express",
		"08" : "UPS ExpeditedSM",
		"11" : "UPS Standard",
		"54" : "UPS Express PlusSM",
		"65" : "UPS Saver",
    };
	private $polandservices = {
		"07" : "UPS Express",
		"08" : "UPS ExpeditedSM",
		"11" : "UPS Standard",
		"54" : "UPS Express PlusSM",
		"65" : "UPS Saver",
		"82" : "UPS Today Standard",
		"83" : "UPS Today Dedicated Courier",
		"84" : "UPS Today Intercity",
		"85" : "UPS Today Express",
		"86" : "UPS Today Express Saver",
    };

    constructor(
        public http: HttpClient,
        public platform: Platform,
        public alertCtrl: AlertController,
        public storage: Storage ) { }

    async post(shippingTo: {
                                name: string,
                                country: string,
                                state: string,
                                city: string,
                                postcode: string,
                                address: string,
                                weight: number
                            }) 
        {    
        let ground = '03', day3_select = '12', day2_air = '02';
        let request = {
                "UPSSecurity": {
                    "UsernameToken": {
                        "Username": "mybeesbox",
                        "Password": "Babar1985"
                    },
                    "ServiceAccessToken": {
                        "AccessLicenseNumber": "4D3563230A81D47D"
                    }
                },
                "RateRequest": {
                    "Request": {
                        "RequestOption": "Rate",
                        "TransactionReference": {
                            "CustomerContext": "Your Customer Context"  // ----------------------------------------------------
                        }
                    },
                    "Shipment": {
                        "Shipper": {// UPS Account Number
                            "Name": "BeesBox",
                            "ShipperNumber": "A7W417",
                            "Address": {
                                "AddressLine": [
                                    "857 E Glenbrook Rd"
                                ],
                                "City": "Milwaukee",
                                "StateProvinceCode": "WI",
                                "PostalCode": "53217",
                                "CountryCode": "US"
                            }
                        },
                        "ShipTo": {  // ----------------------------------------------------
                            "Name": shippingTo.name,
                            "Address": {
                                "AddressLine": "a", //shippingTo.address,
                                "City": shippingTo.city,
                                "StateProvinceCode": shippingTo.state,
                                "PostalCode": shippingTo.postcode,
                                "CountryCode": shippingTo.country
                            }
                        },
                        "ShipFrom": {  // ----------------------------------------------------
                            "Name": "Ship From Name",
                            "Address": {
                                "AddressLine": [
                                    "857 E Glenbrook Rd"
                                ],
                                "City": "MILWAUKEE",
                                "StateProvinceCode": "WI",
                                "PostalCode": "53217",
                                "CountryCode": "US"
                            }
                        },
                        "Service": {    // ----------------------------------------------------
                            "Code": ground.toString(),
                            "Description": "Service Code Description"
                        },
                        "Package": {    // ----------------------------------------------------
                            "PackagingType": {
                                "Code": "02",
                                "Description": "Rate"
                            },
                            "Dimensions": {
                                "UnitOfMeasurement": {
                                    "Code": "IN",
                                    "Description": "inches"
                                },
                                "Length": "1",
                                "Width": "1",
                                "Height": "1"
                            },
                            "PackageWeight": {
                                "UnitOfMeasurement": {
                                    "Code": "Lbs",
                                    "Description": "pounds"
                                },
                                "Weight": shippingTo.weight.toString()
                            }
                        },
                        "ShipmentRatingOptions": {
                            "NegotiatedRatesIndicator": ""
                        }
                    }
                }
        }
        let returnValues = {ground: 0, day3_select: 0, day2_air: 0}
        let res = await this.http.post(this.endpoint, JSON.stringify(request))   // .share() multicast가 가능하여 여러곳에서 subscribe가 가능!
            .catch(e =>  {
                return Observable.throw(e);
            }).toPromise();        
        if(res.Fault) {     
            console.log(res.Fault)       
            // let alert = this.alertCtrl.create({
            //     subTitle: 'Error Code ' + res.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Code,
            //     message: res.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description,
            //     buttons: ['Dismiss']
            // });
            // alert.present();
            return {err: res.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description, rates: null}
        }
        returnValues.ground = res.RateResponse.RatedShipment.TotalCharges.MonetaryValue

        request.RateRequest.Shipment.Service.Code = day3_select.toString()
        res = await this.http.post(this.endpoint, JSON.stringify(request)) 
            .catch(e =>  {
                return Observable.throw(e);
            }).toPromise();
        if(res.Fault) {            
            console.log(res.Fault)       
            // let alert = this.alertCtrl.create({
            //     subTitle: 'Error Code ' + res.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Code,
            //     message: res.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description,
            //     buttons: ['Dismiss']
            // });
            // alert.present();
            return {err: res.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description, rates: null}
        }
        returnValues.day3_select = res.RateResponse.RatedShipment.TotalCharges.MonetaryValue

        request.RateRequest.Shipment.Service.Code = day2_air.toString()
        res = await this.http.post(this.endpoint, JSON.stringify(request)) 
            .catch(e =>  {
                return Observable.throw(e);
            }).toPromise();       
        if(res.Fault) {         
            console.log(res.Fault)       
            // let alert = this.alertCtrl.create({
            //     subTitle: 'Error Code ' + res.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Code,
            //     message: res.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description,
            //     buttons: ['Dismiss']
            // }); 
            // alert.present();
            return {err: res.Fault.detail.Errors.ErrorDetail.PrimaryErrorCode.Description, rates: null}
        } 
        returnValues.day2_air = res.RateResponse.RatedShipment.TotalCharges.MonetaryValue

        return {err: null, rates: returnValues}
    }
}
