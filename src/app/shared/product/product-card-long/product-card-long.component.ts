import { ProductCardLongDetails } from './../product.interface';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-card-long',
  templateUrl: './product-card-long.component.html',
  styleUrls: ['./product-card-long.component.scss'],
})
export class ProductCardLongComponent {
  @Input() productDetails: ProductCardLongDetails;

  constructor() {}
}
