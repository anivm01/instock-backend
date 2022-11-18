const knex = require("knex")(require("../knexfile"));
const uuid = require("uuid");

exports.readAllInventories = async (req, res)=> {
    try{
        const inventoriesData = await knex
        .select('inventories.id',"warehouse_id", "item_name", "description", "category", "status", "quantity", "warehouse_name")
        .from("inventories")
        .join('warehouses', 'inventories.warehouse_id', 'warehouses.id')
        if (inventoriesData.length <= 0) {
            res.status(404).json({
                status: 404,
                message: "Not Found: Couldn't find any inventories."
              })
        }
        res.status(200).json(inventoriesData)    
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "There was an issue with the database",
            error: error
          })
    }
}

exports.createInventory = async (req, res) => {
    try{
        if (!req.body.warehouse_id || 
            !req.body.item_name || 
            !req.body.description || 
            !req.body.category || 
            !req.body.status ) {
            return res.status(400).json({
                status: 400,
                message: "Please make sure to provide a warehouse id, item name, description, category, status and quantity"
              });
          }

        const warehouseToUpdate = await knex.select("*").from("warehouses").where({"warehouses.id": req.body.warehouse_id})
        if (warehouseToUpdate.length === 0 ) {
            return res.status(404).json( { status: 400, message: "Coundn't find the warehouse where you want to add new inventory" } )    
        }

        let timestamp = new Date().toJSON().slice(0, 19)
        const newInventory = {...req.body, id: uuid.v4(), created_at: timestamp, updated_at: timestamp}
        
        const result = await knex("inventories").insert(newInventory);

        const createdInventory = await knex("inventories").where({id: newInventory.id})
        return res.status(201).json(createdInventory)

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Couldn't create new inventory",
            error: error
          });
    }
}

exports.readSingleInventory = async (req, res) => {
    try{
        const inventoryData = await knex
        .select('inventories.id',"warehouse_id", "item_name", "description", "category", "status", "quantity", "warehouse_name")
        .from("inventories")
        .where({"inventories.id": req.params.id})
        .join('warehouses', 'inventories.warehouse_id', 'warehouses.id')
        if (inventoryData.length === 0 ) {
            return res.status(404).json( { status: 400, message: "Coundn't find the inventory you were looking for" } )    
        }
        return res.json(inventoryData[0])    
    } catch (error) {
        res.status(500).json({ status: 500, message: "Unable to retrieve inventory data", error: error})
    }
}

exports.updateSingleInventory = async (req, res) => {
    try{
        const inventoryData = await knex.select("*").from("inventories").where({"inventories.id": req.params.id})
        if (inventoryData.length === 0 ) {
            return res.status(404).json( { status: 400, message: "Coundn't find the inventory you are trying to update" } )    
        }
        if (!req.body.warehouse_id || 
            !req.body.item_name || 
            !req.body.description || 
            !req.body.category || 
            !req.body.status) {
            return res.status(400).json({
                status: 400,
                message: "Please make sure to provide a warehouse id, item name, description, category, status and quantity"
            });
          }
        const timestamp = new Date().toJSON().slice(0, 19)
        const changedInventory = {...req.body, updated_at: timestamp}
        const result = await knex("inventories").where({ "inventories.id": req.params.id }).update(changedInventory);
        const updatedInventory = await knex("inventories").where({"inventories.id": req.params.id})
        return res.status(201).json(updatedInventory[0])
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Unable to update inventory", error: error})
    }
}

exports.deleteSingleInventory = async (req, res) => {
    try {
        const inventoryData = await knex.select("*").from("inventories").where({id: req.params.id})
        if (inventoryData.length === 0 ) {
            return res.status(404).json( { status: 400, message: "Coundn't find the inventory you are trying to delete" } )    
        }
        result = await knex("inventories").where({id: req.params.id}).del()
        return res.status(200).json({status: 204, message: "Inventory successfully deleted"})
        //if status is 204, message doesn't show up
    }
    catch {
        return res.status(500).json({ status: 500, message: "Couldn't delete the inventory"})
    }
}

exports.readAllInventoryCategories = async (req, res)=> {
    try{
        const inventoryCategories = await knex
        .select("category")
        .distinct()
        .from("inventories")
        if (inventoryCategories.length <= 0) {
            res.status(404).json({
                status: 404,
                message: "Not Found: Couldn't find any categories."
              })
        }
        res.status(200).json(inventoryCategories)    
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "There was an issue with the database",
            error: error
          })
    }
}