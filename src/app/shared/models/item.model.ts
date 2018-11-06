import { Product } from './product.model';

export class Item {
    constructor(public product: Product, public quantity: number){}

    get itemPrice(): number {
        return (parseFloat(this.product.price) * this.quantity);
    }
}