import { ProductCardSmallDetails } from './../product.interface';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-product-card-small',
  templateUrl: './product-card-small.component.html',
  styleUrls: ['./product-card-small.component.scss'],
})
export class ProductCardSmallComponent implements OnInit {
  @Input() productDetails: ProductCardSmallDetails;
  @Input() cardHeight: number;
  @Input() cardWidth: number;
  @Input() actionName: string;
  @Input() actionIcon: string;
  @Output() actionClick: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
