const router = require ("express").Router()
const inventoriesController = require("../controllers/inventoriesController")

router
.route("/")
.get(inventoriesController.readAllInventories)
.post(inventoriesController.createInventory);

router
.route("/categories")
.get(inventoriesController.readAllInventoryCategories)

router
.route("/:id")
.get(inventoriesController.readSingleInventory)
.put(inventoriesController.updateSingleInventory)
.delete(inventoriesController.deleteSingleInventory);


module.exports = router;