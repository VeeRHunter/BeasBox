import { Image } from './product.model';


export interface Category {
    id: number;
    name: string;
    slug: string;
    parent: number;
    description: string;
    display: string;
    image: Image;
    menu_order: number;
    count: number;
}