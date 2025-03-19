const mongoose = require("mongoose");
require("dotenv").config();

// Свързване с MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Проверка за грешки при връзката
db.on("error", console.error.bind(console, "❌ Грешка при свързването с MongoDB:"));

// Потвърждение при успешно свързване
db.once("open", () => {
  console.log("✅ Успешно свързване с MongoDB!");
});

module.exports = db;