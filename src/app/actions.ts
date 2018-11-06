import { Action } from '@ngrx/store';
import { Item } from './shared/models/item.model';


export const ADD_APPUSER_REQUEST: string = 'ADD_APPUSER_REQUEST';
export const ADD_APPUSER_SUCCESS: string = 'ADD_APPUSER_SUCCESS';
export const ADD_APPUSER_ERROR: string = 'ADD_APPUSER_ERROR';
export const SET_APPUSER: string = 'SET_APPUSER';
export const LOGOUT_APPUSER: string = 'LOGOUT_APPUSER';
export const UPDATE_APPUSER: string = 'UPDATE_APPUSER';
export const ADD_TO_CART: string = 'ADD_TO_CART';
export const REMOVE_FROM_CART: string = 'REMOVE_FROM_CART';
export const EMPTY_CART: string = 'EMPTY_CART';


export class AddToCart implements Action {
    readonly type = ADD_TO_CART;
    payload: Item;
}


export type StoreActions = AddToCart;