const Cart = require('../models/cart')
const  Iyzipay = require('iyzipay');

var iyzipay = new Iyzipay({
    apiKey: 'sandbox-KEtPghd7YXUc7KDQRE9uRiCaR6Q9wuNt',
    secretKey: 'sandbox-L8qFU593dGMndxOW9X6HyaOdFMiD5i9I',
    uri: 'https://sandbox-api.iyzipay.com'
});


module.exports.getPayment = (req,res) =>{

    res.render('user/payment',{layout:'user/layouts/layout-payment'})
}


module.exports.postPayment =async (req,res) =>{
    const {address,state,zip_code,country,card_number,card_code,month,year,card_name} = req.body
    const user =req.user
   
    Cart.findById(user.usercartid).populate({
        path: 'products',
        populate: {
          path: 'prodcats',
          model: 'prodcats',
        }
      })
      .exec()
    .then(cart=>{        
    const basketItems = cart.products.map(item => ({
        id:1,
        name: item.urun_adi,
        category1: item.prodcats.name,
        category2: item.prodcats.name,
        itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL ,
        price:  item.urun_fiyat
    
  }));  
  const totalAmount = basketItems.reduce((sum, item) => {
    // Fiyatları string olarak alındığı için parseFloat kullanarak toplamı güncelliyoruz
    return sum + parseFloat(item.price);
  }, 0);

 
 
    
     const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        price: totalAmount.toFixed(2),
        paidPrice:totalAmount.toFixed(2),
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        basketId: 'B67832',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: {
            cardHolderName:card_name ,
            cardNumber: card_number,
            expireMonth: month,
            expireYear: year,
            cvc: card_code,
            registerCard: '0'
        },
        buyer: {
            id: 'BY789',
            name: 'John',
            surname: 'Doe',
            gsmNumber: '+905350000000',
            email: 'email@email.com',
            identityNumber: '74300864791',
            lastLoginDate: '2015-10-05 12:43:35',
            registrationDate: '2013-04-21 15:12:09',
            registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34732'
        },
        shippingAddress: {
            contactName:user,
            city: state,
            country:country,
            address: address,
            zipCode: zip_code
        },
        billingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        basketItems: basketItems
            
    };
    
    iyzipay.payment.create(request, function (err, result) {
        console.log(err, result);
     
    });

    });
 
 }
