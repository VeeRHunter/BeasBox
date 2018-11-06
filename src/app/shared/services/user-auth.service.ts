import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import { AppUser } from '../models/app-user.model';
import { DataService } from './data.service';
import { LoginResponse } from '../models/login-response.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import * as firebase from 'firebase';
@Injectable()
export class UserAuthService {
    user$: Observable<firebase.User>;

    constructor(private afAuth: AngularFireAuth, private dataService: DataService) {
        this.user$ = this.afAuth.authState;
    }

    public getAuthenticatedUser(): Observable<firebase.User> {
        return this.afAuth.authState;
    }

    public async loginEmail(email: string, password: string) {
        try {
            return <LoginResponse>{ result: await this.afAuth.auth.signInWithEmailAndPassword(email, password) }
        }
        catch (error) {
            return <LoginResponse>{ error: error }
        }
    }

    public async LoginSocial(method: string) {
        let provider: firebase.auth.AuthProvider;

        switch (method) {
            case 'facebook': {
                provider = new firebase.auth.FacebookAuthProvider();
                break;
            }
            case 'twitter': {
                provider = new firebase.auth.TwitterAuthProvider();
                break;
            }
            default: {
                provider = new firebase.auth.GoogleAuthProvider();
                break;
            }
        }

        try {
            return <LoginResponse>{ result: await this.afAuth.auth.signInWithPopup(provider) }
            // return await this.afAuth.auth.signInWithPopup(provider)
        }
        catch (error) {
            return <LoginResponse>{ error: error }
        }
    }

    public async register(email: string, password: string) {
        try {
            return <LoginResponse>{ result: await this.afAuth.auth.createUserWithEmailAndPassword(email, password) }
        }
        catch (error) {
            return <LoginResponse>{ error: error }
        }

    }

    public logout(): Promise<any> {
        return this.afAuth.auth.signOut();
    }

    public get appUser$(): Observable<AppUser> {
        return this.getAuthenticatedUser().switchMap((user) => {                //passes firebase.User
            if (!user) {                                                         //or returns null
                return Observable.of(null);
            } else if (user.email) {
                return this.dataService.getAppUser(user);                       //returns appUser
            } else {
                return Observable.of(null);
            }
        });
    }

    public get appUser(): Promise<AppUser> {
        return this.dataService.checkStorage('user').then((user: AppUser) => {
            if (!user || !user.email) return null;
            else return user;
        });
    }
}