const mongoose = require('mongoose')
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema({
    studentId: { type: String, unique: true, default: uuidv4 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
})

module.exports = mongoose.model('User', UserSchema)