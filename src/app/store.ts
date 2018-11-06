import { Action } from '@ngrx/store';

import { AppUser } from '../app/shared/models/app-user.model';
import { Cart } from '../app/shared/models/cart.model';

export interface IAppState {
    appUser: AppUser | {};
    cart: Cart | {};
}

const INITIAL_STATE: IAppState = {
    appUser: {},
    cart: {}
};

export function rootReducer(state: IAppState, action: Action): IAppState {
    /*switch(action.type) {
        case ADD_APPUSER_REQUEST: {
            break;
        }
        case SET_APPUSER: {
            
            break;
        }
        case LOGOUT_APPUSER: {
            break;
        }
        case UPDATE_APPUSER: {
            break;
        }

        case ADD_TO_CART: {
            break;
        }
        case REMOVE_FROM_CART: {
            break;
        }
        case EMPTY_CART: {
            break;
        }
    }*/
    return state;
}

function addAppUser(state, action) {

}

function setAppUser(state, action) {

}

function logoutAppUser(state, action) {

}

function updateAppUser(state, action) {

}

function addToCart(state, action) {

}

function removeFromCart(state, action) {

}

function emptyCart(state, action) {

}