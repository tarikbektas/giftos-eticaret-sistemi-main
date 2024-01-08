const mongoose =require('mongoose')

const Schema = mongoose.Schema


const product = new Schema({
   urun_barkod:String,
   urun_adi:String,
   urun_shortdesc:String,
   urun_desc:String,
   urun_fiyat:Number,
   urun_görsel:String ,
   prodcats: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'prodcats',
    }
   })

const Product = mongoose.model('product',product)

module.exports = Product 