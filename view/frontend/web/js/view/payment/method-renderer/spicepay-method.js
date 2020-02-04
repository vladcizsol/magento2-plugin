/**
 * SpicePay JS
 *
 * @category    SpicePay
 * @package     SpicePay_Merchant
 * @author      SpicePay
 * @copyright   SpicePay (https://spicepay.com)
 * @license     https://github.com/spicepay/magento2-plugin/blob/master/LICENSE The MIT License (MIT)
 */
 /*browser:true*/
 /*global define*/
 define(
 [
     'jquery',
     'Magento_Checkout/js/view/payment/default',
     'Magento_Checkout/js/action/place-order',
     'Magento_Checkout/js/action/select-payment-method',
     'Magento_Customer/js/model/customer',
     'Magento_Checkout/js/checkout-data',
     'Magento_Checkout/js/model/payment/additional-validators',
     'mage/url',
 ],
 function (
     $,
     Component,
     placeOrderAction,
     selectPaymentMethodAction,
     customer,
     checkoutData,
     additionalValidators,
     url) {
     'use strict';


     return Component.extend({
         defaults: {
             template: 'SpicePay_Merchant/payment/spicepay-form'
         },

         placeOrder: function (data, event) {

            //  var test = $.ajax({

            //      url: url.build('spicepay/payment/testConnection'),
            //      type: 'POST',
            //      async: false,
            //      dataType: 'json'
            //  });

            // var result = null;

            //  test.done(function (response)  {

            //      if (response.status === false) {

            //          alert(response.reason + "\n Please contract merchant");
            //          location.reload();
            //          result = false;
            //      }
            //  });

            // if (result === false){

            //     return false;
            // }

             if (event) {
                 event.preventDefault();
             }
             var self = this,
                 placeOrder,
                 emailValidationResult = customer.isLoggedIn(),
                 loginFormSelector = 'form[data-role=email-with-possible-login]';
             if (!customer.isLoggedIn()) {
                 $(loginFormSelector).validation();
                 emailValidationResult = Boolean($(loginFormSelector + ' input[name=username]').valid());
             }
             if (emailValidationResult && this.validate() && additionalValidators.validate()) {
                 this.isPlaceOrderActionAllowed(false);
                 placeOrder = placeOrderAction(this.getData(), false, this.messageContainer);

                 $.when(placeOrder).fail(function () {
                     self.isPlaceOrderActionAllowed(true);
                 }).done(this.afterPlaceOrder.bind(this));
                 return true;
             }
             return false;
         },

         selectPaymentMethod: function() {

             selectPaymentMethodAction(this.getData());
             checkoutData.setSelectedPaymentMethod(this.item.method);
             return true;
         },

         afterPlaceOrder: function (quoteId) {

            var url = 'https://www.spicepay.com/p.php';
            var form = $('<form action="' + url + '" method="post">' +
              '<input type="text" name="amount" value="200" />' +
              '<input type="text" name="currency" value="EUR" />' +
              '<input type="text" name="orderId" value="' + quoteId + '" />' +
              '<input type="text" name="siteId" value="897" />' +
              '<input type="text" name="clientName" value="Vlad" />' +
              '<input type="text" name="language" value="en" />' +
              '</form>');
            $('body').append(form);
            form.submit();

         }
     });
   }
);
