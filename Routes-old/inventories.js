const express = require("express");
const router = express.Router();
const fs = require("fs");
const utils = require("../Utils/Utils");
const uuid = require("uuid");

//GET inventory list
router.get("/", (req, res) => {
  // Read the file
  const inventories = utils.readInventory();

  const inventoriesInfo = inventories.map((inventory) => {
    //Filter the information to not to get unnecessary data
    return {
      id: inventory.id,
      warehouseName: inventory.warehouseName,
      itemName: inventory.itemName,
      category: inventory.category,
      status: inventory.status,
      quantity: inventory.quantity,
    };
  });

  //Response
  if (inventories.length === 0) {
    return  res.status(500).json( {error: "internal server error!" })
    }
  res.status(200).json(inventoriesInfo);
});

//created a get a single inventory item request based on id
router.get("/inventory/:inventoryId", (req, res) => {
  // Read the file
  const inventories = utils.readInventory();
  // Finding the single inventory whose id matches the requested id
  const singleInventory = inventories.find(
    (inventory) => inventory.id === req.params.inventoryId
  );
  if (!singleInventory) {
    return  res.status(404).json( {error: "could not find requested inventory!" })
    }
  res.status(200).json(singleInventory);
});

router.put("/inventory/:inventoryId", (req, res) => {
  //form validation
  const name = req.body.itemName;
  const description = req.body.description;
  const quantity = req.body.quantity;
  const status = req.body.status;
  const category = req.body.category;
  const warehouse = req.body.warehouseName;

  //validate name
  if (!name) {
    return res.status(400).json({ error: "please fill the name input" });
  }
  //validate description
  if (!description) {
    return res.status(400).json({ error: "please fill the description input" });
  }
  //validate category
  if (!category) {
    return res.status(400).json({ error: "please fill the category field!" });
  }

  //validate status
  if (status !== "In Stock" && status !== "Out of Stock") {
    return res.status(400).json({ error: "please fill in the correct status" });
  }

  //validate quantity and in stock
  if (status === "In Stock") {
    if (quantity === 0) {
      return res
        .status(400)
        .json({ error: "quantity seems to be 0 put the status out of stock" });
    }
  }

  //validate quantity and out of stock
  if (status === "Out of Stock") {
    if (quantity !== 0) {
      return res
        .status(400)
        .json({ error: "quantity needs to be 0 to be out of stock" });
    }
  }
  //validate if number is negative or an actual number
  if (isNaN(quantity)) {
    return res.status(400).json({ error: "please fill in a number" });
  }

  if (quantity < 0) {
    return res
      .status(400)
      .json({ error: "quantity needs to be a positive number" });
  }

  //validate a warehouse to make sure it exist
  const warehouses = utils.readWarehouse();
  const warehouseNames = [];

  for (let i = 0; i < warehouses.length; i++) {
    warehouseNames.push(warehouses[i].name);
  }

  if (!warehouseNames.includes(warehouse)) {
    return res
      .status(400)
      .json({ error: "please input an existing warehouse" });
  }

  const inventories = utils.readInventory();
  const reqItem = req.params.inventoryId;
  //finding the item to update
  const itemToUpdate = inventories.find((item) => item.id === reqItem);
  //modifying the fields of the item
  itemToUpdate.itemName = req.body.itemName;
  itemToUpdate.description = req.body.description;
  itemToUpdate.category = req.body.category;
  itemToUpdate.status = req.body.status;
  itemToUpdate.quantity = req.body.quantity;

  //updating the id of the warehouse to match the warehouse name when updating
  const requestedWareHouseName = req.body.warehouseName;
  if (itemToUpdate.warehouseName !== requestedWareHouseName) {
    const newWarehouse = warehouses.find((warehouse) => {
      return warehouse.name === requestedWareHouseName;
    });

    itemToUpdate.warehouseID = newWarehouse.id;
    itemToUpdate.warehouseName = requestedWareHouseName;
  }
  //finding the items index to be removed
  const itemFind = inventories.findIndex((item) => item.id === reqItem);
  //removing the items index
  inventories.splice(itemFind, 1);
  //adding updated item to array
  inventories.push(itemToUpdate);
  //re writing the file
  fs.writeFileSync("./Data/inventory.json", JSON.stringify(inventories));
  //sending the response with a 201 created
  res.status(202).json(itemToUpdate);
});

//GET the inventory of selected warehouse
router.get("/warehouse/:warehouseId", (req, res) => {
  //Read the file
  const inventories = utils.readInventory();

  //Find selected warehouse, which id matches the id from url
  const selectedInventories = inventories.filter(
    (inventory) => inventory.warehouseID === req.params.warehouseId
  );

  res.status(200).json(selectedInventories);
});

//delete inventory item
router.delete("/inventory/:inventoryId", (req, res) => {
  const inventories = utils.readInventory();
  const idToDelete = req.params.inventoryId;
  const requestedInventory = inventories.find((inventory) => inventory.id === idToDelete);

  if (!requestedInventory) {
    return res.status(500).send();
  }
  const inventoryToDelete = inventories.indexOf(requestedInventory)
  inventories.splice(inventoryToDelete, 1)
  fs.writeFileSync("./Data/inventory.json", JSON.stringify(inventories));

  res.status(204).send();
});

//get all existing inventory categories
router.get("/categories", (req, res) => {
  const inventories = utils.readInventory();
  const inventoryCategories = inventories.map(inventory=>{
    return inventory.category
  })
  const uniqueCategories = [...new Set(inventoryCategories)]
  res.status(200).json(uniqueCategories);

})

//post a new inventory item
router.post("/", (req, res) => {
  // get existing data 
  const warehouses = utils.readWarehouse();
  const inventories = utils.readInventory();

  //form validation
  const name = req.body.itemName;
  const description = req.body.description;
  const quantity = req.body.quantity;
  const status = req.body.status;
  const category = req.body.category;
  const warehouse = req.body.warehouseName;

  //validate name
  if (!name) {
    return res.status(400).json({ error: "please fill the name input" });
  }
  //validate description
  if (!description) {
    return res.status(400).json({ error: "please fill the description input" });
  }
  //validate category
  if (!category) {
    return res.status(400).json({ error: "please fill the category field!" });
  }

  //validate status
  if (status !== "In Stock" && status !== "Out of Stock") {
    return res.status(400).json({ error: "please fill in the correct status" });
  }

  //validate quantity and in stock
  if (status === "In Stock") {
    if (quantity === 0) {
      return res
        .status(400)
        .json({ error: "quantity seems to be 0 put the status out of stock" });
    }
  }

  //validate quantity and out of stock
  if (status === "Out of Stock") {
    if (quantity !== 0) {
      return res
        .status(400)
        .json({ error: "quantity needs to be 0 to be out of stock" });
    }
  }
  //validate if number is negative or an actual number
  if (isNaN(quantity)) {
    return res.status(400).json({ error: "please fill in a number" });
  }

  if (quantity < 0) {
    return res
      .status(400)
      .json({ error: "quantity needs to be a positive number" });
  }

  //validate a warehouse to make sure it exist
  const warehouseNames = [];

  for (let i = 0; i < warehouses.length; i++) {
    warehouseNames.push(warehouses[i].name);
  }

  if (!warehouseNames.includes(warehouse)) {
    return res
      .status(400)
      .json({ error: "please input an existing warehouse" });
  }

  //find the warehouse that is being added to
    const selectedWarehouse = warehouses.find((item) => {
      return item.name === warehouse;
    });

  //validation to make sure that the item being added doesn't already exist in this warehouse
  const selectedWarehouseInventory = inventories.filter(inventory => inventory.warehouseName === warehouse)
  console.log(selectedWarehouse)
  const selectedWarehouseInventoryItems = selectedWarehouseInventory.map(item => {
    return item.itemName
  })
  if (selectedWarehouseInventoryItems.includes(name)){
    return res.status(404).json("this item already exists in this warehouse. maybe you should try updating the quantity instead.")
  }

  //create new item
  const newItem = {
    id: uuid.v4(),
    itemName: name,
    description: description,
    category: category,
    status: status,
    quantity: quantity,
    warehouseName: warehouse,
    warehouseID: selectedWarehouse.id
  }

  //add the new item to the inventory array
  inventories.push(newItem);
  //re writing the file
  fs.writeFileSync("./Data/inventory.json", JSON.stringify(inventories));
  //sending the response with a 201 created
  res.status(202).json(newItem);
  }
)
module.exports = router;
