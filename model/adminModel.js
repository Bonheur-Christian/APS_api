const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 }
})

const admin = mongoose.model("admin", adminSchema);

module.exports = admin