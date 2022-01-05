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

const BACKEND_URL = environment.production
  ? environment.backend_url_secure
  : environment.backend_url;

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private httpService: HttpClient) {}

  async addImage(addImageData: AddImageData | any): Promise<AddImageResponse> {
    return await this.httpService
      .post<AddImageResponse>(
        BACKEND_URL + secureAPIURIs.addImage,
        addImageData,
      )
      .toPromise();
  }

  async deleteImage(imageId: string): Promise<DeleteImageResponse> {
    return await this.httpService
      .delete<DeleteImageResponse>(
        BACKEND_URL + secureAPIURIs.deleteImage + `/?imageId=${imageId}`,
      )
      .toPromise();
  }

  async getImageByProductId(
    productId: string,
  ): Promise<GetImageByProductIdResponse> {
    return await this.httpService
      .get<GetImageByProductIdResponse>(
        BACKEND_URL +
          basicAPIURIs.getImageByProductId +
          `/?productId=${productId}`,
      )
      .toPromise();
  }
}
