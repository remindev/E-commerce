import express from 'express';
import * as users from '../controller/users.js';
import * as auth from '../controller/services/auth.js';
import * as admin from '../controller/admin.js';
import * as api_service from './user_api.js';

const app = express.Router();

app.get('/test', (req, res) => {
    res.send({ status: "good", message: "Test message form server" });
})

app.use('/api', api_service.default);

// apis - api for user sign in 
app.post('/user_signin', auth.mustLogoutAsUserAPI, users.signInInitAPI);
// api for login user with password
app.post('/user_signin_password/:id', auth.mustLogoutAsUserAPI, users.signInWithPasswordAPI);
// api for forget password
app.post('/forget_password/:id', auth.mustLogoutAsUserAPI, users.signInRecoveryPasswordAPI);
// api for recover wit email 
app.post('/forget_password/email/:id', auth.mustLogoutAsUserAPI, users.verifyEmailOTPAPI);
// api for reset password 
app.post('/reset_password/:id', auth.mustLogoutAsUser, users.resetPasswordAPI);
// api for signin with google
app.post('/user_signin_google', auth.mustLogoutAsUserAPI, users.loginWithGoogleAPI);
// api for signin with phone
app.post('/user_signin_phone', auth.mustLogoutAsUserAPI, users.loginWithOtpAPI);
// api for user logout
app.post('/user_logout', auth.mustLoginAsUserAPI, users.logoutAPI)
    .post('/user_logout/from/:id', auth.mustLoginAsUserAPI, users.logoutSessionAPI);
// api for user registration
app.post('/user_registration', auth.mustLogoutAsUserAPI, users.signupAPI);
// api for enter passewordd and name 
app.post('/user_registration/:id', auth.mustLogoutAsUserAPI, users.signupSetpTwoAPI);
// api for add to cart
app.post('/cart_action', auth.mustLoginAsUserAPI, users.addTOCartAPI);
// api for add to_car importance is to update
app.put('/cart_action', auth.mustLoginAsUserAPI, users.addTOCartAPI);
// api for add to cart
app.delete('/cart_action', auth.mustLoginAsUserAPI, users.deleteFormCartAPI);
// api for addign user address
app.post('/user_address', auth.mustLoginAsUserAPI, users.addUserAddressAPI);
// api for updating user address
app.put('/user_address', auth.mustLoginAsUserAPI, users.updateUserAddressAPI);
// api for delete user address
app.delete('/user_address', auth.mustLoginAsUserAPI, users.deleteUserAddressAPI);

// api place order
app.post('/checkout', auth.mustLoginAsUserAPI, users.checkoutCartProductsAPI);
// api veryfy payment
app.post('/checkout/verify', auth.mustLoginAsUserAPI, users.checkOutVerifyRazorpayAPI);
// api for captur paypal payment
app.post('/checkout/:id/capture/:orderID', auth.mustLoginAsUserAPI, users.checkOutVerifyPaypalAPI);
// api to get address by addressID
app.post('/checkout/address', auth.mustLoginAsUserAPI, users.getAddressByAddressID);
// api for cancel order
app.post('/orders/cancel/', auth.mustLoginAsUserAPI, users.cancelOrderAPI);
// api for reutrn order
app.post('/orders/return/', auth.mustLoginAsUserAPI, users.returnOrderAPI);
// api for update user data
app.put('/user_data/update', auth.mustLoginAsUserAPI, users.updateUserDataAPI);
// api for failed orders 
app.delete('/orders/failed/:id', auth.mustLoginAsUserAPI, users.failedOrders);
// api for adding product to wishlist
app.post('/wishlist/:id', auth.mustLoginAsUserAPI, users.addToWishListAPI);
// api for deleteing from wishlist
app.delete('/wishlist/:id', auth.mustLoginAsUserAPI, users.deleteFromWishListAPI);

// api for create user using referal codes
app.get('/referal_', users.referalInit);

// sub - dev api's
// api for get all products form cart
app.post('/cart_all', auth.mustLoginAsUserAPI, users.getAllProductsFormCartAPI);

// usersign in page
app.get('/user_signin', auth.mustLogoutAsUser, users.login);
// userPassword prompt
app.get('/user_signin/:id', auth.mustLogoutAsUser, users.loginSecond);
// forget passowrd
app.get('/forget_password/:id', auth.mustLogoutAsUser, users.forgetPassword);
// email forget password recovery 
app.get('/forget_passowrd/email/:id', auth.mustLogoutAsUser, users.verifyEmailOTP);
// new password creater 
app.get('/reset_password/:id', auth.mustLogoutAsUser, users.resetPassword);
// user signIN
// app.get('/user_signin/:id', auth.mustLogoutAsUser, users.login);
// usersign with phone in page
app.get('/user_signin_phone', auth.mustLogoutAsUser, users.loginWithOtp);
// create user page
app.get('/user_registration', auth.mustLogoutAsUser, users.signup);
// step two create user
app.get('/user_registration/:id', auth.mustLogoutAsUser, users.signupStepTwo);


// to set essential locals for render
app.use(users.localsForUser);

// to track request count to server
app.use(users.analytics);

// home page
app.get('/', users.urlHistory, users.home);
// shop page
app.get('/shop', users.urlHistory, users.shop);
// products page
app.get('/product/:id', users.urlHistory, users.product);

// user auth must routes
app.get('/cart', users.urlHistory, auth.mustLoginAsUser, users.cart);
// wishlist page
app.get('/wishlist', users.urlHistory, auth.mustLoginAsUser, users.wishlist);
// dashboard page
app.get(['/dashboard', '/dashboard/account'], users.urlHistory, auth.mustLoginAsUser, users.dashboard);
// ordres page
app.get('/dashboard/orders', users.urlHistory, auth.mustLoginAsUser, users.ordersPg);
// wallet page
app.get('/dashboard/wallet', users.urlHistory, auth.mustLoginAsUser, users.walletPg);
// address page
app.get('/dashboard/address', users.urlHistory, auth.mustLoginAsUser, users.addressPg);
// security page dash
app.get('/dashboard/security', users.urlHistory, auth.mustLoginAsUser, users.securityPg);
// checkout page
app.get('/checkout', users.urlHistory, auth.mustLoginAsUser, users.checkout);
// category
app.get('/c/:id', users.urlHistory, users.category);
// dashboard navigator mb
app.get('/mb/dashboard', users.urlHistory, auth.mustLoginAsUser, users.dashboard_mb);
// invoice 
app.get('/order/invoice/:id', auth.mustLoginAsUser, users.invoiceData);

export default app;