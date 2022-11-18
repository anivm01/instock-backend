const express = require("express");
const router = express.Router();
const fs = require("fs");
const utils = require("../Utils/Utils");
const uuid = require("uuid");

//created a get request to obtain all warehouses
router.get("/", (_req, res) => {
  // Read the file
  const warehouses = utils.readWarehouse();

  if (warehouses.length === 0) {
    return res.status(500).json({ error: "internal server error!" });
  }

  res.status(200).json(warehouses);
});

//GET single warehouse
router.get("/warehouse/:warehouseId", (req, res) => {
  //Read th file
  const warehouses = utils.readWarehouse();

  // Finding the single warehouse whose id matches the requested id
  const singleWarehouse = warehouses.find(
    (warehouse) => warehouse.id === req.params.warehouseId
  );

  if (!singleWarehouse) {
    return res
      .status(404)
      .json({ error: "could not find requested warehouse!" });
  }

  res.status(200).json(singleWarehouse);
});

// POST a new warehouse
router.post("/", (req, res) => {
  //validation
  const name = req.body.name;
  const address = req.body.address;
  const city = req.body.city;
  const country = req.body.country;
  const contactName = req.body.contact?.name;
  const contactPosition = req.body.contact?.position;
  const contactPhone = req.body.contact?.phone;
  const contactEmail = req.body.contact?.email;

  //Read the file
  const warehouses = utils.readWarehouse();

  //making sure all fields are required
  if (
    !name ||
    !address ||
    !city ||
    !country ||
    !contactName ||
    !contactPosition ||
    !contactPhone ||
    !contactEmail
  ) {
    return res.status(400).json({ error: "please fill all fields!" });
  }

  // warehouse name validation

  if (name.length < 2) {
    return res.status(400).json({ error: "name should be longer!" });
  }
  const warehouseNames = warehouses.map(warehouse=>{
    return warehouse.name
  })
  if (warehouseNames.includes(name)){
    return res.status(400).json({ error: "This warehouse name already exists" });
  }

  // country validation

  //  --get all countries from json
  const countries = utils.readCountries();
  // --check if the country is in the array of countries
  const isCountry = countries.find((item) => item.name === country);

  if (isCountry === undefined) {
    return res.status(400).json({ error: "not a valid country!" });
  }

  //  email validation
  // ----check if the email includes @@
  if (!contactEmail.includes("@")) {
    return res.status(400).json({ error: "not a valid email!" });
  }

  // phone validation

  const isPhoneValid = utils.validatePhoneNumber(contactPhone);

  if (!isPhoneValid) {
    return res.status(400).json({ error: "not a valid phone number!" });
  }


  // New warehouse to be added
  const newWarehouse = {
    id: uuid.v4(),
    name: name,
    address: address,
    city: city,
    country: country,
    contact: {
      name: contactName,
      position: contactPosition,
      phone: contactPhone,
      email: contactEmail,
    },
  };

  // Add new wahrehouse to the array
  warehouses.push(newWarehouse);

  //re writing the file
  fs.writeFileSync("./Data/warehouse.json", JSON.stringify(warehouses));

  res.status(201).json(newWarehouse);
});

//PUT/EDIT a specific warehouse
router.put("/warehouse/:warehouseId", (req, res) => {
  //form validation
  const name = req.body.name;
  const address = req.body.address;
  const city = req.body.city;
  const country = req.body.country;
  const contactName = req.body.contact?.name;
  const contactPosition = req.body.contact?.position;
  const contactPhone = req.body.contact?.phone;
  const contactEmail = req.body.contact?.email;

  //every field has to be filled
  if (
    !name ||
    !address ||
    !city ||
    !country ||
    !contactName ||
    !contactPosition ||
    !contactPhone ||
    !contactEmail
  ) {
    return res.status(400).json({ error: "please fill all fields!" });
  }

  // warehouse name validation

  if (name.length < 2) {
    return res.status(400).json({ error: "name should be longer!" });
  }

  // country validation

  //  --get all countries from json
  const countries = utils.readCountries();
  // --check if the country is in the array of countries
  const isCountry = countries.find((item) => item.name === country);

  if (isCountry === undefined) {
    return res.status(400).json({ error: "not a valid country!" });
  }

  //  email validation
  // ----check if the email includes @
  if (!contactEmail.includes("@")) {
    return res.status(400).json({ error: "not a valid email!" });
  }

  // phone validation

  const isPhoneValid = utils.validatePhoneNumber(contactPhone);

  if (!isPhoneValid) {
    return res.status(400).json({ error: "not a valid phone number!" });
  }

  //Read warehouses file
  const warehouses = utils.readWarehouse();

  // id of the warehouse thats going to be edited
  const requestedWarehouse = req.params.warehouseId;
  //finding the warehouse to update
  const warehouseToUpdate = warehouses.find(
    (warehouse) => warehouse.id === requestedWarehouse
  );
  //modifying the fields of the item
  warehouseToUpdate.name = name;
  warehouseToUpdate.address = address;
  warehouseToUpdate.city = city;
  warehouseToUpdate.country = country;
  warehouseToUpdate.contact.name = contactName;
  warehouseToUpdate.contact.position = contactPosition;
  warehouseToUpdate.contact.phone = contactPhone;
  warehouseToUpdate.contact.email = contactEmail;

  //finding the items index to be removed
  const warehouseFind = warehouses.findIndex(
    (warehouse) => warehouse.id === requestedWarehouse
  );
  //removing the items index
  warehouses.splice(warehouseFind, 1);
  //adding updated item to array
  warehouses.push(warehouseToUpdate);
  fs.writeFileSync("./Data/warehouse.json", JSON.stringify(warehouses));
  //sending the response with a 201 created
  res.status(201).json(warehouseToUpdate);
});

//Get all warehouse names
router.get("/names", (req, res)=> {
  const warehouses = utils.readWarehouse();

  if (warehouses.length === 0) {
    return  res.status(500).json( {error: "internal server error!" })
    }
  
    const warehouseNames = warehouses.map(warehouse=>{
      return warehouse.name
      })

  if (warehouseNames.length === 0) {
    return  res.status(500).json( {error: "internal server error!" })
    }
    
  res.status(200).json(warehouseNames);
})
//Delete single warehouse and their related inventories
router.delete("/warehouse/:warehouseId", (req, res) => {
  const warehouseId = req.params.warehouseId;
  //Read from the warehouse files
  const warehouses = utils.readWarehouse();
  //Find the index of the warehouse with that id
  const warehouseFind = warehouses.findIndex(
    (warehouse) => warehouse.id === warehouseId
  );

  console.log(warehouseFind);
  //respond with an error message if the warehouse ID does not exist
  const warehouseNotFound = warehouses.find(
    (warehouse) => warehouse.id === warehouseId
  );
  
  if (!warehouseNotFound) {
    return res
      .status(404)
      .json({ error: "The warehouse you are trying to delete does not exist" });
  }

  //Delete It
  warehouses.splice(warehouseFind, 1);

  //Write the whole array back to the file
  fs.writeFileSync("./Data/warehouse.json", JSON.stringify(warehouses));

  //find the warehouseID in the inventory data associated with the warehouse
  const inventories = utils.readInventory();

  for (let i = inventories.length - 1; i >= 0; i--) {
    const inventory = inventories[i];
    if (inventory.warehouseID === warehouseId) {
      //Delete It
      inventories.splice(i, 1);
    }
  }
  fs.writeFileSync("./Data/inventory.json", JSON.stringify(inventories));

  //Respond with a message that the note has been deleted
  res.status(204).send();
});

module.exports = router;
