export const environment = {
  production: true,
  backend_url: '',
  backend_url_secure: '',
  debug: false,
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
