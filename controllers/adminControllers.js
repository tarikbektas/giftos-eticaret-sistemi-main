const mongoose = require('mongoose')

const Setting = require('../models/settings')
const Slider =require('../models/slider')
const Pages  = require('../models/pages')
const Prodcat = require('../models/prodcats') 
const Product = require('../models/product')
const Navbar= require('../models/navbar')
const Blog = require('../models/blog')
const Services = require('../models/services')
const News = require('../models/news')
const Order= require('../models/order')



const path = require('path');
const multer = require('multer')
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
  















module.exports.getİndex = (req, res) => {
   Order.find().populate('products').populate('user')
   .then(orders=>{
    const totalorders = orders.length
    function countOrdersWithStatus(orders, targetStatus) {
      const count = orders.reduce((accumulator, order) => {
        if (order.status === targetStatus) {
          return accumulator + 1;
        }
        return accumulator;
      }, 0);
    
      return count;
    }
    const tamamnlanansiparis = countOrdersWithStatus(orders, 'Sipariş Tamamlandı');
    const bekleyensiparis =countOrdersWithStatus(orders, 'ödeme alındı');
    const kargodakisiparis =countOrdersWithStatus(orders, 'Kargoya Verildi');
    
    res.render('admin/components/index', { layout: 'admin/layouts/layout',orders:orders,totalorders,tamamnlanansiparis,bekleyensiparis,kargodakisiparis})
   }
 
    
    )
     

  
}



module.exports.getSetting = (req,res) =>{
    res.render('admin/pages/setting',{layout:'admin/layouts/layout'})    
}
 

module.exports.getSlider= (req,res) =>{
  Slider.find()
  .then(slider =>{
    res.render('admin/pages/slider/getslider', { layout: 'admin/layouts/layout',slider:slider});
  })
 
}

module.exports.getSLideradd = (req,res) =>{
  res.render('admin/pages/slider/addslider',{layout:'admin/layouts/layout'})
}
module.exports.deleteslider = (req,res) =>{
  const id = req.body.id;
  Slider.deleteOne({_id:id})
  .then(()=>{
    console.log("slider silindi")
    res.redirect('/admin/slider')
  })
}




// ---------------------------------------------------------------------------------------
// PAGES BÖLÜMÜ

module.exports.getaddPages = (req,res) =>{
  res.render('admin/pages/pages/addpages',{layout:'admin/layouts/layout'})    

}
module.exports.postPage = (req,res) =>{
  const title = req.body.title;
  const link = req.body.link;
  const desc = req.body.editor1
  console.log('gelen title değeri: ',title)
  const pages = new Pages({
    title : title,
    url : link,
    desc:desc
  })
  pages.save()
  .then(result =>{
    console.log('sayfa eklendi')
    res.redirect('/admin/page')
  })

}
 
module.exports.getPages = (req,res)=>{
  Pages.find()
  .then(pages=>{
    res.render('admin/pages/pages/pages',{layout:'admin/layouts/layout',pages : pages})
  })
  
}



module.exports.postDeletePages = (req,res) =>{
  const id = req.body.id
  Pages.deleteOne({_id:id})
  .then(result=>{
    console.log('sayfa silindi')
    res.redirect('/admin/page')

  })

}
module.exports.getEditPages = (req,res) =>{
  const id = req.params.id
  Pages.find({_id:id})
  .then(page=>{
    res.render('admin/pages/pages/editpages',{layout:'admin/layouts/layout',page:page})
  })

  
}

module.exports.postEditPages = (req,res) =>{
  const title = req.body.title ;
  const url = req.body.link ;
  const desc = req.body.editor1
  const id = req.body.id

  Pages.find({_id:id})
  .then((pages)=>{
    pages.title = title,
    pages.url = url;
    pages.desc = desc

     return pages.save()

  })
  .then(()=>{
    console.log('sayfa güncellendi')
    res.redirect('/admin/page')
  })

}

module.exports.pagesDetials = (req,res) =>{
  const url = req.params.url
  Pages.findOne({url:url})
  .then(page=>{
    res.render('admin/pages/pages/pagesdetials',{layout:'admin/layouts/layout',page:page})
  })
}

// ---------------------------------------------------------------------------------------


 


module.exports.getAddProduct = (req,res)=>{
  Prodcat.find()
  .then(category =>{
    res.render('admin/pages/product/addproduct',{layout:'admin/layouts/layout',category:category})
  })
 
}
 

module.exports.getProduct = (req,res) =>{
  Product.find().populate('prodcats','name')
  .then(product=>{
    
    res.render('admin/pages/product/getproduct',{layout:'admin/layouts/layout',product:product})
  })
}

 

module.exports.deleteProduct = (req,res)=>{
  const id = req.body.id
 
  Product.deleteOne({_id:id})
  .then(()=>{
    console.log("ürün silindi")
    res.redirect('/admin/product')
  })
}







 



module.exports.getCategory = (req,res) =>{
  Prodcat.find()
  .then(category =>{
    res.render('admin/pages/category/category',{layout:'admin/layouts/layout',category:category})
  })
 
}

module.exports.addCategory = (req,res) =>{
  res.render('admin/pages/category/addcategory',{layout:'admin/layouts/layout'})
}
module.exports.postCategory = (req,res) =>{
  const name = req.body.name;
  const desc = req.body.desc

    const category = new Prodcat({
      name : name,
      desc :desc
    })
    category.save()
    .then(()=>{
      console.log('katagori eklendi')
      res.redirect('/admin/category')
    })
}
module.exports.deleteCategory = (req,res) =>{
 const id = req.body.id
 Prodcat.deleteOne({_id:id})
 .then(category =>{
  console.log('katagori silindi')
  res.redirect('/admin/category')
 })
 
}




// ---------------------------------------------------------------------------
// NAVBAR BÖLÜMĞ

module.exports.getNavbar = (req,res) =>{
  Navbar.find().sort({sira:1})
  .then(navbar=>Pages.find()
  .then(pages=>{
    res.render('admin/pages/navbar/addnavbar',{layout:'admin/layouts/layout',navbar:navbar,pages:pages})
  }))
  

}

module.exports.postNavbar = (req,res)=>{
  const type = req.body.type;
  const title = req.body.title;
  const url = req.body.link;
  const sira = req.body.sira;
  const url2= req.body.link2

  const navbar = new Navbar({
    type:type,
    title:title,
    sira:sira,
    url:url,
    url2:url2
  })
  navbar.save()
  .then(()=>{
    console.log('Navbar Kaydedildi')
    res.redirect('/admin/navbar')
  })
 
}

module.exports.deleteNavbar = (req,res) =>{
  const id = req.body.id

  Navbar.deleteOne({_id:id})
  .then(()=>{
    console.log('navbar silindi')
    res.redirect('/admin/navbar')
  })
}

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Blog Controllers

module.exports.getBlog = (req,res) =>{
  Blog.find()
  .then(blog =>{
    res.render('admin/pages/blog/getblog',{layout:'admin/layouts/layout',blog:blog})
  })
}

module.exports.getAddBlog = (req,res) =>{
  res.render('admin/pages/blog/addblog',{layout:'admin/layouts/layout'})
}
 

module.exports.postDeleteBlog = (req,res) =>{
  const id = req.body.id
  Blog.deleteOne({_id:id})
  .then(result=>{
    console.log('blog silindi')
    res.redirect('/admin/blog')
  })
}

 


// ---------------------------------------------------------------------------



// ---------------------------------------------------------------------------
// Blog Controllers

module.exports.getServices = (req,res) =>{
  Services.find()
  .then(services=>{
    res.render('admin/pages/services/getservices',{layout:'admin/layouts/layout',services:services})

  })
}


module.exports.getAddServices = (req,res) =>{
  res.render('admin/pages/services/addservices',{layout:'admin/layouts/layout'})
}


module.exports.deleteServices = (req,res) =>{
  const id = req.body.id

  Services.deleteOne({_id:id})
  .then(result=>{
    console.log('servis silindi')
    res.redirect('/admin/services')
  })
}

// --------------------------------------------------------------
  // haberler

module.exports.getNews = (req,res) =>{
  News.find()
  .then(news=>{
    res.render('admin/pages/news/getnews',{layout:'admin/layouts/layout',news:news})
  })
} 


module.exports.getAddNews = (req,res) =>{
  res.render('admin/pages/news/addnews',{layout:'admin/layouts/layout'})


}

module.exports.newsDetials = (req,res)=>{
  const id = req.params.id
  News.find({_id:id})
  .then(news=>{
    res.render('admin/pages/news/newsdetials',{layout:'admin/layouts/layout2',news:news})
  })
}


// --------------------------------------------------------------


module.exports.getTest = (req,res) =>{
  res.render('admin/pages/test',{layout:'admin/layouts/layout'})
}

module.exports.postTest = (req,res) =>{
  const katagori = req.body.categories
  res.send('test ')
  console.log('gelen katagori bilgisi:',katagori)
}
