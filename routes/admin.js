const express =require('express')
const router  =express.Router();
const admincontrollers =require('../controllers/adminControllers')
const mongoose = require('mongoose');

const Setting =require('../models/settings')
const Slider =require('../models/slider')
const Product = require('../models/product')
const Blog = require('../models/blog')
const Services = require('../models/services')
const News = require('../models/news');



const path = require('path');
const multer = require('multer');
const upload = multer({ 
    storage: multer.diskStorage({
      destination: 'public/admin/uploads/',
      filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const filename = file.originalname.replace(extname, '').toLowerCase().split(' ').join('-') + '-' + Date.now() + extname;
        cb(null, filename);
      }
    })
  });
  


router.get('/',admincontrollers.getİndex)

router.get('/setting',admincontrollers.getSetting)
router.post('/setting',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]),  (req, res) => {
    const title = req.body.site_title;
    const desc = req.body.site_description;
    const keywords = req.body.site_keywords;
    const phone = req.body.phone;
    const instagram = req.body.instagram_username;
    const facebook = req.body.facebook_username;
    const email = req.body.email;
    const bakim = req.body.is_live;
    const short_desc = req.body.short_desc;
    const twitter = req.body.twitter_username;
    const adres = req.body.address;
    const url = req.body.site_url
    const youtube = req.body.youtube_username;
    const iframe= req.body.iframe;
    const files1 = req.files['image1'];
    const files2 = req.files['image2'];
    const image1Path = files1 && files1[0] ? path.join( 'uploads/', files1[0].filename) : null;
    const image2Path = files2 && files2[0] ? path.join( 'uploads/', files2[0].filename) : null;

    Setting.findById('656b2a1a561b548b0534fc5f')
    .then(setting => {
      if (!setting) {
        console.log('Belge bulunamadı.');
        return;
      }
  
      // Belgeyi güncelle
      setting.site_title = title;
      setting.site_description = desc;
      setting.site_keywords = keywords;
      setting.short_desc = short_desc;
      setting.instagram_username = instagram;
      setting.site_url = url;
      setting.bakim_modu = bakim;
      setting.facebook_username = facebook;
      setting.phone = phone; // Eğer bu alanları güncellemek istiyorsanız, yorum satırından çıkarın
      setting.twitter_username = twitter;
      setting.email = email; // Eğer bu alanları güncellemek istiyorsanız, yorum satırından çıkarın
      setting.youtube_username = youtube;
      setting.address = adres;
      setting.logo = image1Path;
      setting.favicon = image2Path;
      setting.iframe_id = iframe;
  
      // Belgeyi kaydet
      return setting.save();
      
    })
    .then(updatedSetting => {
        
      console.log('Belge başarıyla güncellendi:', updatedSetting);
      
    })
    .then(()=>{
        res.redirect('setting',)
    })
    .catch(error => {
      console.error('Güncelleme hatası:', error);
    });
   
  })


router.get('/slider',admincontrollers.getSlider)
router.get('/add-slider',admincontrollers.getSLideradd)
router.post('/slider',upload.fields([{ name: 'image1', maxCount: 1 }]),  (req, res) => {
  const files1 = req.files['image1'];
  const title = req.body.title;
  const desc = req.body.editor1;
  const sira = req.body.sira
  const link = req.body.link
  const img = req.files['image1'];
  
  const image1Path = files1 && files1[0] ? path.join( 'uploads/', files1[0].filename) : null;
  const slider = new Slider({
    slider_sira : sira,
    slider_title : title,
    slider_img : image1Path,
    slider_desc:desc,
    slider_link:link
  })
  slider.save()
  .then(result=>{
    console.log("slider eklendi")
    res.redirect('slider')
  })
})
router.post('/deleteslider',admincontrollers.deleteslider)



router.get('/add-pages',admincontrollers.getaddPages)
router.post('/add-pages',admincontrollers.postPage)
router.get('/page',admincontrollers.getPages)
router.post('/delete-pages',admincontrollers.postDeletePages)
router.get('/edit-pages/:id',admincontrollers.getEditPages)
router.post('/edit-pages',admincontrollers.postEditPages)
router.get('/pages/:url',admincontrollers.pagesDetials)

// -----------------------------------------------------------
// Ürün routes
router.get('/add-product',admincontrollers.getAddProduct)
router.get('/product',admincontrollers.getProduct)
router.post('/product',upload.fields([{ name: 'image1', maxCount: 1 }]),  (req, res) => {
  const files1 = req.files['image1'];
  const img = req.files['image1'];
  const title = req.body.title;
  const desc = req.body.desc;
  const short_desc = req.body.short_desc;
  const barcode = req.body.barcode
  const category = req.body.category_id
  const price = req.body.price

 
  
  const image1Path = files1 && files1[0] ? path.join( 'uploads/', files1[0].filename) : null;
  const product = new Product({
    urun_barkod:barcode,
    prodcats:category,
    urun_adi:title,
    urun_shortdesc:short_desc,
    urun_desc:desc,
    urun_fiyat:price,
    urun_görsel:image1Path,

  })
  product.save()
  .then(result=>{
    console.log("ürün  eklendi")
    res.redirect('product')
  })
})

router.post('/delete-product',admincontrollers.deleteProduct)



// -----------------------------------------------------------

router.get('/category',admincontrollers.getCategory)
router.post('/category',admincontrollers.postCategory)
router.post('/delete-catagory',admincontrollers.deleteCategory)
router.get('/add-category',admincontrollers.addCategory)




router.get('/navbar',admincontrollers.getNavbar)
router.post('/navbar',admincontrollers.postNavbar)
router.post('/navbar-delete',admincontrollers.deleteNavbar)

// -----------------------------------------------------------

router.get('/blog',admincontrollers.getBlog)
router.get('/add-blog',admincontrollers.getAddBlog)
router.post('/add-blog',upload.fields([{ name: 'image1', maxCount: 1 }]),  (req, res) => {
  const files1 = req.files['image1'];
  const title= req.body.title;
  const desc = req.body.editor1;


 
  
  const image1Path = files1 && files1[0] ? path.join( 'uploads/', files1[0].filename) : null;
  const blog = new Blog({
    title:title,
    desc:desc,
    img:image1Path

  })
  blog.save()
  .then(result=>{
    console.log("blog  eklendi")
    res.redirect('blog')
  })
})



router.post('/delete-blog',admincontrollers.postDeleteBlog)

// -----------------------------------------------------------
router.get('/add-services',admincontrollers.getAddServices)

router.get('/services',admincontrollers.getServices)
router.post('/add-services',upload.fields([{ name: 'image1', maxCount: 1 }]),  (req, res) => {
  const files1 = req.files['image1'];
  const title= req.body.title;
  const desc = req.body.editor1;

 
  const image1Path = files1 && files1[0] ? path.join( 'uploads/', files1[0].filename) : null;
  const services = new Services({
    title:title,
    desc:desc,
    img:image1Path

  })
  services.save()
  .then(result=>{
    console.log("hizmet eklendi  eklendi")
    res.redirect('services')
  })
})



router.post('/delete-services',admincontrollers.deleteServices)

// -----------------------------------------------------------

router.get('/news',admincontrollers.getNews)
router.get('/add-news',admincontrollers.getAddNews)
router.post('/add-news',upload.fields([{ name: 'image1', maxCount: 1 }]),  (req, res) => {
  const files1 = req.files['image1'];
  const title= req.body.title;
  const desc = req.body.editor1;

 
  const image1Path = files1 && files1[0] ? path.join( 'uploads/', files1[0].filename) : null;
  const news = new News({
    title:title,
    desc:desc,
    img:image1Path

  })
  news.save()
  .then(result=>{
    console.log("haber eklendi  eklendi")
    res.redirect('news')
  })
})

router.get('/news/:id',admincontrollers.newsDetials)

 

 



router.post('/test',(req,res)=>{
  console.log('test routes')
})

// router.get('/test',admincontrollers.getTest)
// router.post('/test',admincontrollers.postTest )



module.exports = router