const mongoose =require('mongoose')

const Schema = mongoose.Schema


const cart = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
      }]
})


const Cart = mongoose.model('cart',cart)

module.exports = Cart 