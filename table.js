const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  table_number: { type: Number, unique: true },
  capacity: Number,
  status: { type: String, default: "available" },
});

const Table = mongoose.model("Table", tableSchema);
module.exports = Table;