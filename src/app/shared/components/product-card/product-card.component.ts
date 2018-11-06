import { Component, Input } from '@angular/core';

@Component({
    selector: 'product-card',
    templateUrl: 'product-card.html'
})
export class ProductCardComponent {

    @Input('product') product: any;

    constructor() {

    }


}