const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  table_number: Number,
  date: Date,
  time: String,
  status: { type: String, default: "pending" },
});

// Комбиниран индекс за customer_id и статус
reservationSchema.index({ customer_id: 1, status: 1 });

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;