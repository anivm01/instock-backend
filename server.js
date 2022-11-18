require('dotenv').config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const warehousesRoutes = require("./routes/warehouseRoutes.js");
const inventoriesRoutes = require("./routes/inventoryRoutes.js");
let PORT = process.env.PORT;


app.use(cors());

app.use(express.json());

app.use("/warehouses", warehousesRoutes);
app.use("/inventories", inventoriesRoutes);

app.listen(PORT, () => {
  console.log(`I'm here and I'm listening on port`+ ' ' + PORT );
});
