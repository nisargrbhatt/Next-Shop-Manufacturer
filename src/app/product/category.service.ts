import { Observable } from 'rxjs';
import { GetAllCategoryResponse } from './category.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
  environment,
  secureAPIURIs,
  basicAPIURIs,
} from 'src/environments/environment';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpService: HttpClient) {}

  getAllCategories(): Observable<any> {
    return this.httpService
      .get<GetAllCategoryResponse>(BACKEND_URL + basicAPIURIs.getAllCategories)
      .pipe(map((response) => response.data));
  }
}
