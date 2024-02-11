const mongoose =require('mongoose')
const Cart =require('../models/cart')

const Schema = mongoose.Schema


const UserSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password :{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart'
    }


})

UserSchema.post('findOne', async function (user) {
    if (user && !user.cart) {
      // Kullanıcının sepeti yoksa, yeni bir sepet oluştur
      const cart = await Cart.create({});
      user.cart = cart._id;
      await user.save();
    }
  });



const User = mongoose.model("User",UserSchema)


module.exports = User