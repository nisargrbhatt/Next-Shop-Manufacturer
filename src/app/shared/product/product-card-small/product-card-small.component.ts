import { ProductCardSmallDetails } from './../product.interface';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-card-small',
  templateUrl: './product-card-small.component.html',
  styleUrls: ['./product-card-small.component.scss'],
})
export class ProductCardSmallComponent {
  @Input() productDetails: ProductCardSmallDetails;
  @Input() actionName: string;
  @Input() actionIcon: string;
  @Input() review: [number, number] = [0, 0];
  @Output() actionClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}
}
