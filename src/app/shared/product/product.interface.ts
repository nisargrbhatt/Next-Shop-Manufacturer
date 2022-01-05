export interface ProductCardSmallDetails {
  name?: string;
  category?: string;
  images?: Image[];
}

export interface Image {
  file: string;
  url: string;
}
