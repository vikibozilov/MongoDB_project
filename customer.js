const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: { type: String, unique: true },
  loyalty_points: { type: Number, default: 0 },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = { Customer };