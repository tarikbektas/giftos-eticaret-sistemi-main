const userControler = require('../controllers/userController')
const paymentController = require('../controllers/paymentController')

const express =require('express')
const router=express.Router();
const Slider = require('../models/slider')
const Pages = require('../models/pages')
const Product = require('../models/product')
const Cart = require('../models/cart')

 
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      console.log('giriş başarılı devam edin')
    return next();
  }
  res.redirect('/login');
}

router.get('/',(req,res)=>{

   Slider.find().sort({sira:1})
   .then(slider =>{
      res.render('user/index',{layout:'user/layouts/layout',slider:slider})
   })
   
})

router.get('/pages/:url',userControler.getpages)



router.get('/urunler',userControler.getProduct)
router.get('/urunler/:id',userControler.getProductDetials)


router.get('/login',userControler.getUserLogin)

router.get('/register',userControler.getUserRegister)

router.post('/login',userControler.postUserLogin)
router.post('/logout',userControler.postUserLogout)

router.post('/register',userControler.postUserRegister)

router.post('/add-to-cart',isLoggedIn,userControler.addtocart);
router.post('/cart-delete',isLoggedIn,userControler.deleteaCart)


router.get('/dashboard',isLoggedIn, userControler.dashboard);  

router.get('/payment',isLoggedIn,paymentController.getPayment)
router.post('/payment',isLoggedIn,paymentController.postPayment)

module.exports =router

 