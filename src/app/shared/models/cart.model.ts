import { Item } from './item.model';

 
export class Cart {
    items: Item[] = [];
    constructor(pItems: Item[] = [] /*, dateCreated?: string*/ ) {
        this.items = pItems
    }

    get cartItemCount(): number {
        let counter = 0;
        if (this.items.length === 0) {
            return counter;
        } else {
            for (let item of this.items) {
                counter += item.quantity;
            }
            return counter; 
        }
    }

    get cartTotalPrice(): number {
        let counter = 0;
        if (!this.items) {
            return counter;
        } else {
            for (let item of this.items) {
                counter += item.itemPrice;
            }
            return counter;
        }
    }
}