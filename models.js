const mongoose = require("mongoose");

// Схема за клиентите
const customerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  loyalty_points: Number,
});

// Схема за резервациите
const reservationSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  table_number: Number,
  date: String,
  time: String,
  status: String,
});

const Customer = mongoose.model("Customer", customerSchema);
const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = { Customer, Reservation };

const tableSchema = new mongoose.Schema({
    number: Number,
    capacity: Number,
    location: String,
    status: { type: String, default: "available" },
  });
  
  const Table = mongoose.model("Table", tableSchema);
  
  module.exports = { Customer, Reservation, Table };