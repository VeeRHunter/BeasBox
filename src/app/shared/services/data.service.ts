import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';

import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AppUser } from '../models/app-user.model';

import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';
import { Order } from '../models/order.model';


@Injectable()
export class DataService {

    profileObject: AngularFireObject<AppUser>;
    orderObject: AngularFireObject<any>;

    constructor(private afDb: AngularFireDatabase, public storage: Storage) { }

    async saveAppUser(user: firebase.User, appUser?: AppUser) {
        let tempName: string = user.email.substring(0, user.email.lastIndexOf('@'));
        this.profileObject = this.afDb.object<AppUser>(`/users/${user.uid}`);

        if (appUser) {
            try { return await this.profileObject.update(appUser) }
            catch (e) { console.log(e) }
        }
        else {
            try {
                return await this.profileObject.set({
                    id: user.uid,
                    name: user.displayName || tempName,
                    email: user.email
                });
            }
            catch (e) { console.log(e) }
        }
    }

    getAppUser(user: firebase.User): Observable<AppUser> {
        this.checkStorage('user').then((appUser: AppUser) => {
            if (appUser && (appUser.email === user.email)) this.saveAppUser(user, appUser);
        });

        this.profileObject = this.afDb.object<AppUser>(`/users/${user.uid}`);
        return this.profileObject.valueChanges();
    }

    async removeAppUser() {
        try { await this.storage.remove('user') }
        catch (e) { console.log(e) }
    }

    async placeOrder(order) {
        await this.afDb.list<any>(`/orders`).push(order).then(val => {
            console.log(val);
        });
    }

    getOrders(user: firebase.User): firebase.database.Query {
        return this.afDb.list<any>(`/orders`).query.orderByChild('email').equalTo(user.email)
    }

    async checkStorage(k: string) {
        try {
            return await this.storage.get(k);
        }
        catch (e) { console.log(e) }

    }

    async saveKeyToStorage(k: string, v: any) {
        try {
            return await this.storage.set(k, v);
        }
        catch (e) { console.log(e) }

    }


}