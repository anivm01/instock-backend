const router = require ("express").Router()
const warehousesController = require("../controllers/warehousesController")

router
.route("/")
.get(warehousesController.readAllWarehouses)
.post(warehousesController.createWarehouse);

router
.route("/:id")
.get(warehousesController.readSingleWarehouse)
.put(warehousesController.updateSingleWarehouse)
.delete(warehousesController.deleteSingleWarehouse);

router
.route("/:id/inventories")
.get(warehousesController.readSingleWarehouseInventory)


module.exports = router;