const express = require("express");
const { Customer, Reservation, Table } = require("./models"); // Импортираме всичко от models.js
require("./db");  // Импортиране на MongoDB свързване

const app = express();
app.use(express.json());

// Индексиране на полета
Customer.schema.index({ email: 1 });  // Индекс за email
Reservation.schema.index({ customer_id: 1, status: 1 }); // Комбиниран индекс за customer_id и статус

// Пример за агрегация: Групиране на резервации по статус
async function groupReservations() {
  const result = await Reservation.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  console.log(result);
}

// Пример за агрегация: Сортиране на клиенти по лоялни точки
async function getSortedCustomers() {
  const customers = await Customer.aggregate([
    { $sort: { loyalty_points: -1 } }
  ]);
  console.log(customers);
}

// Маршрути (endpoints)

// Клиенти
app.get("/customers", async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

app.post("/customers", async (req, res) => {
  const newCustomer = new Customer(req.body);
  await newCustomer.save();
  res.status(201).json(newCustomer);
});

// Резервации
app.get("/reservations", async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Грешка при получаването на резервации" });
  }
});

app.post("/reservations", async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(400).json({ message: "Грешка при добавянето на резервация" });
  }
});

// Маси
app.get("/tables", async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ message: "Грешка при получаването на маси" });
  }
});

app.post("/tables", async (req, res) => {
  try {
    const newTable = new Table(req.body);
    await newTable.save();
    res.status(201).json(newTable);
  } catch (error) {
    res.status(400).json({ message: "Грешка при добавянето на маса" });
  }
});

// Извикване на агрегациите при стартиране
getSortedCustomers();
groupReservations();

// Стартиране на сървъра
app.listen(5000, () => {
  console.log("Сървърът работи на порт 5000");
});
