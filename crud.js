const { Customer, Reservation } = require("./models"); // Дефиниране на двата модела
require("./db"); // Връзка към базата данни

// Функция за създаване на нов клиент
async function createCustomer(name, phone, email, loyalty_points) {
  const existingCustomer = await Customer.findOne({ email }); // Проверка дали клиентът съществува
  if (existingCustomer) {
    console.log("Клиентът с този email вече съществува!");
  } else {
    const customer = new Customer({
      name,
      phone,
      email,
      loyalty_points,
    });
    await customer.save();
    console.log(`Клиентът ${name} е записан!`);
  }
}

// Функция за създаване на резервация
async function createReservation(customerId, tableNumber, date, time) {
  const existingReservation = await Reservation.findOne({
    customer_id: customerId,
    date,
    time,
  });

  if (existingReservation) {
    console.log("Резервацията за този клиент за тази дата и час вече съществува!");
  } else {
    const reservation = new Reservation({
      customer_id: customerId,
      table_number: tableNumber,
      date,
      time,
      status: "pending",
    });
    await reservation.save();
    console.log("Резервацията е записана!");
  }
}

// Функция за обновяване на клиент
async function updateCustomer(id, loyaltyPoints) {
  const updatedCustomer = await Customer.updateOne(
    { _id: id },
    { $set: { loyalty_points: loyaltyPoints } }
  );
  if (updatedCustomer.nModified > 0) {
    console.log("Обновен клиент");
  } else {
    console.log("Няма промени в клиента");
  }
}

// Функция за изтриване на клиент
async function deleteCustomer(id) {
  const deletedCustomer = await Customer.deleteOne({ _id: id });
  if (deletedCustomer.deletedCount > 0) {
    console.log("Клиентът е изтрит");
  } else {
    console.log("Няма такъв клиент за изтриване");
  }
}

// Функция за извеждане на всички клиенти
async function getCustomers() {
  const customers = await Customer.find();
  console.log("Всички клиенти:", customers);
}

// Функция за сортиране на клиентите по точки
async function getSortedCustomers() {
  const customers = await Customer.find().sort({ loyalty_points: -1 });
  console.log("Клиенти, сортирани по точки:", customers);
}

// Функция за групиране на резервации по статус
async function groupReservations() {
  const result = await Reservation.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  console.log("Групирани резервации по статус:", result);
}

// Функция за извеждане на всички резервации
async function getReservations() {
  const reservations = await Reservation.find();
  console.log("Резервациите в базата данни:", reservations);
}

// Основна функция за изпълнение на различните операции
async function main() {
  try {
    // 1. Създаване на клиенти
    await createCustomer("Иван Петров", "+359888123456", "ivan@example.com", 100);
    await createCustomer("Мария Георгиева", "+359888987654", "maria@example.com", 50);

    // 2. Извеждане на всички клиенти
    await getCustomers();

    // 3. Извеждане на сортирани клиенти по точки
    await getSortedCustomers();

    // 4. Създаване на резервации
    const customer1 = await Customer.findOne({ email: "ivan@example.com" });
    const customer2 = await Customer.findOne({ email: "maria@example.com" });

    await createReservation(customer1._id, 3, "2025-03-10", "20:00");
    await createReservation(customer2._id, 5, "2025-03-10", "18:00");

    // 5. Групиране на резервации по статус
    await groupReservations();

    // 6. Извеждане на резервациите в базата
    await getReservations();

    // 7. Обновяване на клиент (ако имаме ID и стойности за обновяване)
    const args = process.argv.slice(2);
    if (args[0] === "update" && args[1]) {
      const clientId = args[1];
      await updateCustomer(clientId, 150); // Обновяваме клиента с даденото ID
    }

    // 8. Изтриване на клиент (ако имаме ID за изтриване)
    if (args[0] === "delete" && args[1]) {
      const clientId = args[1];
      await deleteCustomer(clientId); // Изтриваме клиента с даденото ID
    }

  } catch (err) {
    console.error("Грешка:", err);
  }
}

// Извикваме основната функция
main();