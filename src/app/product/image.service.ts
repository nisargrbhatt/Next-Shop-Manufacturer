import { Observable } from 'rxjs';
import {
  AddImageResponse,
  AddImageData,
  DeleteImageResponse,
  GetImageByProductIdResponse,
} from './image.interface';
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
export class ImageService {
  constructor(private httpService: HttpClient) {}

  addImage(addImageData: AddImageData | any): Observable<any> {
    return this.httpService.post<AddImageResponse>(
      BACKEND_URL + secureAPIURIs.addImage.url,
      addImageData,
    );
  }

  deleteImage(imageId: string): Observable<any> {
    return this.httpService.delete<DeleteImageResponse>(
      BACKEND_URL + secureAPIURIs.deleteImage.url + `/?imageId=${imageId}`,
    );
  }

  getImageByProductId(productId: string): Observable<any> {
    return this.httpService
      .get<GetImageByProductIdResponse>(
        BACKEND_URL +
          basicAPIURIs.getImageByProductId +
          `/?productId=${productId}`,
      )
      .pipe(map((response) => response.data));
  }
}
