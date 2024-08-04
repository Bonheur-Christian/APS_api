const mongoose = require('mongoose')

const AddressSchema = new mongoose.Schema({
    tel: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    location: { type: String, required: true }
})

const Address = mongoose.model("Address", AddressSchema);

module.exports = Address;