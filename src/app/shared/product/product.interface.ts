export interface ProductCardSmallDetails {
  id?: string;
  name?: string;
  category?: string;
  image?: string;
}

export interface ProductCardLongDetails {
  name?: string;
  category?: string;
  image?: string;
  small_description: string;
}
