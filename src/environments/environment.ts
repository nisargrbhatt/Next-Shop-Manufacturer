// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  backend_url: 'http://localhost:3001',
  backend_url_secure: 'https://localhost:3002',
  debug: true,
  auth0ClientId: 'YSCYOG2xmB9HRR7LYGf21NeZEzWFGFGw',
  auth0Audience: 'http://localhost:3001',
  auth0Domain: 'dev-qf3-53r4.us.auth0.com',
  role: 'Manufacturer',
};

export const basicAPIURIs = [];

export const secureAPIURIs = {
  // User Controller
  oAuthCall: '/user/oAuthCall',
  getUser: '/user/getUser',
  getEmailOtp: '/user/getEmailOtp',
  emailOtpCheck: '/user/emailOtpCheck',
  // Address Controller
  getAddresses: '/address/getAddresses',
  getAddress: '/address/getAddress',
  createAddress: '/address/createAddress',
  updateAddress: '/address/updateAddress',
  deleteAddress: '/address/deleteAddress',
  // Review Controller
  addReview: '/review/addReview',
  updateReview: '/review/updateReview',
  getReview: '/review/getReview',
  // Cart Controller
  addToCart: '/cart/addToCart',
  updateQuantityCart: '/cart/updateQuantityCart',
  deleteTheItem: '/cart/deleteTheItem',
  getCart: '/cart/getCart',
  // Price Controller
  addPrice: '/price/addPrice',
  updatePrice: '/price/updatePrice',
  getPrice: '/price/getPrice',
  getPricesByMerchantId: '/price/getPricesByMerchantId',
  // Product Controller
  createProduct: '/product/createProduct',
  updateProduct: '/product/updateProduct',
  approveProduct: '/product/approveProduct',
  // Category Controller
  addCategory: '/category/addCategory',
  updateCategory: '/category/updateCategory',
  // Image Controller
  addImage: '/image/addImage',
  deleteImage: '/image/deleteImage',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
