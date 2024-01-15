const mongoose = require('mongoose')


const Schema = mongoose.Schema


const order = new Schema ({
    conversationId :String,
    customer:String,
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
      }],
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      price:String,
      status:String,
      shippingAddress:String,
      billingAddress:String,
      createdAt: { type: Date, default: Date.now },

})

const Order = mongoose.model('order',order)

module.exports = Order 