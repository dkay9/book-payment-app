const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    amount: Number,
    status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Payment', paymentSchema)