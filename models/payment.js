const mongoose =require('mongoose')

const Schema = mongoose.Schema


const payment = new Schema({
   
     sendData:[{
        type: Object
     }],
     getData:[{
        type:Object
     }],
     createdAt: { type: Date, default: Date.now }

})

const Payment = mongoose.model('payment',payment)

module.exports = Payment 