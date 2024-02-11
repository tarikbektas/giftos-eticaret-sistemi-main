const Cart = require('../models/cart')
const  Iyzipay = require('iyzipay');
const crypto = require('crypto');

const Payment = require('../models/payment')
const Order = require('../models/order')

var iyzipay = new Iyzipay({
    apiKey: process.env.apiKey ,
    secretKey: process.env.secretKey,
    uri: 'https://sandbox-api.iyzipay.com'
});


module.exports.getPayment = async (req,res) =>{
    const user = req.user;
  
  const cart =  await   Cart.findById(user.usercartid).populate('products')
     
        console.log('kart bilgisi',cart)
        res.render('user/payment/payment',{layout:'user/layouts/layout-payment',cart})

   
   
    
}


module.exports.postPayment =async (req,res) =>{
    function generateRandomNumber() {
        const randomValue = crypto.randomBytes(5).toString('hex');
        const randomNumber = parseInt(randomValue, 16);
        const conversationId = randomNumber % 10000000000;  
        return conversationId.toString().padStart(10, '0');  
      }
      
      const conversationId = generateRandomNumber();
      
    const ipAddress = req.socket.remoteAddress;
    const {address,state,zip_code,country,card_number,card_code,month,year,card_name} = req.body
    const user =req.user
    let username = user.name + '' + user.surname 

    Cart.findById(user.usercartid).populate({
        path: 'products',
        populate: {
          path: 'prodcats',
          model: 'prodcats',
        }
      })
      .exec()
    .then(cart=>{    
        const orderedProducts = cart.products;
        console.log('order product bilgisi',orderedProducts)
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
        conversationId: conversationId,
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
            id: user.id,
            name: user.name,
            surname: user.surname,
            gsmNumber: user.phone,
            email: user.email,
            identityNumber: user.id,
            lastLoginDate: '2015-10-05 12:43:35',
            registrationDate: '2013-04-21 15:12:09',
            registrationAddress: address,
            ip: ipAddress,
            city: state,
            country: country,
            zipCode: zip_code
        },
        shippingAddress: {
            contactName:username,
            city: state,
            country:country,
            address: address,
            zipCode: zip_code
        },
        billingAddress: {
            contactName: username,
            city: state,
            country: country,
            address: address,
            zipCode: zip_code
        },
        basketItems: basketItems
            
    };
    
    iyzipay.payment.create(request, function (err, result) {
        // console.log(err, result); iyzicodan dönen sonuç
        const deger = result.status
        const errorMessage  = result.errorMessage
        console.log('değer:',deger)
        if(result.status ==="success") {
            res.render('user/payment/succsesspage',{layout:'user/layouts/layout-payment',conversationId})
           
          const orderitems = new Order({
            user:user.id,
            products: orderedProducts.map(item => item._id),
            price:totalAmount.toFixed(2),
            status:'ödeme alındı',
            shippingAddress: address  + ' ' + state + ' ' + country,
            billingAddress: address  + ' ' + state + ' ' + country,
            conversationId:conversationId

          })
            orderitems.save()
            .then(result =>
                console.log('sipariş alındı')
                
            )

        }
         
        if(result.status ==='failure'){

            res.render('user/payment/failurepage',{layout:'user/layouts/layout-payment',conversationId,errorMessage})


        }
        const paymentdata = new Payment({ 
            sendData:request,
            getData:result
        })
        paymentdata.save()
       

    });
          
    });
 
 }



 module.exports.updateOrderStatus = (req,res) =>{
    const status = req.body.status
    const orderid = req.body.orderid
     
    Order.findByIdAndUpdate(
        {_id:orderid},
        {status:status},
        {new:true}
        ).then(
            res.redirect('/admin')

        )
        

 }