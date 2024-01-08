const Pages = require('../models/pages')
const Product =require('../models/product')
const Cart = require('../models/cart')
 

const formValidation =require('../validation/formValidation')
const bcrypt = require('bcrypt');
const User = require('../models/User')
const passport=require('passport')
require('../authentication/passport/local')

 

module.exports.getpages = (req,res) =>{
    const url = req.params.url
   Pages.findOne({url})
   .then(page=>{
    res.render('user/pages/pagesdetials',{layout:'user/layouts/layout',page:page})
   })
   
  }



module.exports.getProduct = (req,res) =>{
  Product.find()
  .then(product=>{
    res.render('user/product/shop',{layout:'user/layouts/layout',product:product})
  })
}


module.exports.getProductDetials = (req,res) =>{
  const id = req.params.id
  Product.findById(id).populate('prodcats','name')
  .then(product=>{

    res.render('user/product/productdetials',{layout:'user/layouts/layouts2',product:product})
   
  })
}

 
module.exports.getUserLogin = (req,res,next) =>{

  res.render('user/login-register/login',{layout:'user/layouts/layout3'})


}

module.exports.getUserRegister = (req,res,next)=>{
  const username =""
  const password =""
  const erorrs = ""
  res.render('user/login-register/register',{layout:'user/layouts/layout3',username:username,password,erorrs:erorrs})
  
}


module.exports.postUserLogin =  passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  successFlash:true,
  failureFlash: true
 
})




module.exports.postUserRegister = (req,res,next)=>{
  const email = req.body.email;
  const password=req.body.password;
  const name = req.body.name;
  const lastname = req.body.lastname;
  const phone = req.body.phone
  const errors = [];
  const validationerrors =formValidation.registerValidation(email,password)
  if(validationerrors.length>0) {
      
      return res.render('user/login-register/register',{
         email :email,
          password,
          name,
          lastname,
          phone,
          erorrs:validationerrors})
  }
  User.findOne({
      email
  })
  .then(user =>{
      if(user) {
          errors.push({message:"E-MAİL Already in use"})
           return res.render('pages/register',{layout:'layouts/layouts',password:password,erorrs:errors,name:name,lastname:lastname,phone:phone,email:email})
      }
     
      bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
              const newUser = new User({
                  name:name,
                  lastname:lastname,
                  email:email,
                  phone:phone,
                  password:hash 
                 })
                 newUser.save()
                 .then(()=>{
                  console.log('veri kaydedildi')
                  req.flash('loginsuccess', 'kayıt  başarılı');
                  res.redirect('/')
                 }) 
                 
                 
          });
      });
     
  })

  
}


module.exports.addtocart =  async (req, res) => {
  const { productId } = req.body;
const user = req.user;
  try {
  // Ürünü sepete ekle
  const product = await Product.findById(productId);
  const cart = await Cart.findById(user.usercartid);
  cart.products.push(product);
  await cart.save();

  res.redirect('/');
} catch (error) {
  console.error(error);
  res.redirect('/');
}
}


module.exports.deleteaCart =  async  (req,res) =>{
  const productId = req.body.productId
  const user = req.user;
  console.log('product id',productId)
  try {
    // Kullanıcının sepetini al
    const userCart = await Cart.findById({ _id: user.usercartid });

    if (!userCart) {
      console.log('Kullanıcıya ait sepet bulunamadı.');
      return res.redirect('/dashboard');
    }

    // Sepet içinde belirli bir ürünü filtrele ve yeni bir ürün listesi oluştur
    userCart.products = userCart.products.filter(product => product.product.toString() !== productId);

    // Sepeti kaydet
    await userCart.save();

    console.log(`Ürün (${productId}) başarıyla sepetten çıkarıldı.`);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.redirect('/dashboard');
  }
  
}




module.exports.dashboard = async (req, res) => {
  const user = req.user;
  
  const cart = await Cart.findById(user.usercartid).populate('products');
  const total = calculateTotal(cart.products);
  function calculateTotal(products) {
    return products.reduce((total, product) => total + product.urun_fiyat, 0);
  }
  res.render('user/dashboard', {layout:'user/layouts/layout3',cart,total:total});
  
}


module.exports.postUserLogout = (req, res) => {
  // Oturumu sonlandır
  req.logout(function(err) {
      if (err) {
          // Hata işleme
          console.error('Logout hatası:', err);
          return next(err); // Hata durumunda middleware zincirini sonlandırma
      }

      // İsteği ve yanıtı yönlendirme veya başka bir işlem yapma
      res.redirect('/'); // Örneğin, ana sayfaya yönlendirme
  });
}