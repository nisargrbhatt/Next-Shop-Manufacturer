import { BehaviorSubject, EMPTY, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ProductService } from './../product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ProductCardSmallDetails } from 'src/app/shared/product/product.interface';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
} from 'rxjs/operators';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  mybreakpoint: number;

  searchText = '';

  totalApprovals = 0;
  approvalsPerPage = 20;
  currentPage = 1;

  search = new FormControl('');

  pageNumber = new BehaviorSubject<number>(1);

  public searchData: { rows: any[]; count: number } = { rows: [], count: 0 };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.mybreakpoint = window.innerWidth <= 1000 ? 2 : 4;
    this.subs.sink = this.search.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((search) => search.trim().length !== 0),
        switchMap((search) =>
          this.productService.getAllProductsWithSearch(
            this.pageNumber.getValue(),
            20,
            search,
          ),
        ),
      )
      .subscribe((data) => {
        this.searchData = data;
      });

    this.subs.sink = this.pageNumber
      .asObservable()
      .pipe(
        distinctUntilChanged(),
        switchMap(() => {
          // if (this.search.value === '') {
          //   return EMPTY;
          // }
          return this.productService.getAllProductsWithSearch(
            this.pageNumber.getValue(),
            20,
            this.search.value.trim(),
          );
        }),
      )
      .subscribe((data) => {
        this.searchData = data;
      });
  }

  onProductClick(id: string): void {
    this.router.navigate(['/product/' + id]);
  }

  getProductCardDetails(product: any): ProductCardSmallDetails {
    return {
      id: product.id,
      name: product.name,
      category: product.category.name,
      image: product.images[0].url,
    };
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber.next(event.pageIndex + 1);
  }

  handleSize(event: any): void {
    this.mybreakpoint = event.target.innerWidth <= 1000 ? 2 : 4;
    if (event.target.innerWidth <= 532) {
      this.mybreakpoint = 1;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
