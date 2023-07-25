const express = require("express");
const app = express();
const PORT = 3003;
const menuData = require("./data/menuData.json");
const orderData = require("./data/orderData.json");
const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "data", "orderData.json"); // "data" - name of folder

app.use(express.json());

// Обработка GET-запроса на главную страницу
app.get("/", (req, res) => {
  res.send("Добро пожаловать в кафе!");
});

// API для получения меню кафе
app.get("/api/menu", (req, res) => {
  res.json(menuData);
});

// API для получения заказа
app.get("/api/getSelectedItems", (req, res) => {
  res.json(orderData);
});

// API для сохранения выбранных элементов
app.post("/api/saveSelectedItems", (req, res) => {
  const { items } = req.body;
  // const selectedItems = items;

  // Считываем текущие данные из orderData.json, если файл существует
  let selectedItems = [];
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, "utf8");
    selectedItems = JSON.parse(data);
  }

  // Дополняем текущие данные новыми выбранными элементами
  selectedItems.push(...items);

  // Создание файла "orderData.json", если он не существует
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, "[]");
  }

  // Сохранение данных в файл JSON
  fs.writeFile(dataFilePath, JSON.stringify(selectedItems), (err) => {
    if (err) {
      console.error("Ошибка при сохранении данных:", err);
      res.status(500).json({ error: "Ошибка при сохранении данных" });
    } else {
      console.log("Данные успешно сохранены в файл JSON.");
      res.sendStatus(200);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Listening PORT >>> ${PORT}`);
});
