const fs = require("fs");

// Read inventory
const readInventory = () => {
  const inventoryFile = fs.readFileSync("./Data/inventory.json");
  const inventoryData = JSON.parse(inventoryFile);
  return inventoryData;
};

// Read warehouse
const readWarehouse = () => {
  const warehouseFile = fs.readFileSync("./Data/warehouse.json");
  const warehouseData = JSON.parse(warehouseFile);
  return warehouseData;
};

//Read countries for validation
function readCountries() {
  const countriesFile = fs.readFileSync("./Data/countries.json");
  const countries = JSON.parse(countriesFile);
  return countries;
}

// used RegExp to validate the phone number
function validatePhoneNumber(input_str) {
  const re = /^\+?[0-9]?[- ]?\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/

  return re.test(input_str);
}

module.exports = { readInventory, readWarehouse, readCountries, validatePhoneNumber };
