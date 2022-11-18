const knex = require("knex")(require("../knexfile"));
const uuid = require("uuid");

exports.readAllWarehouses = async (req, res)=> {
    try{
        const warehousesData = await knex
        .select("id", "warehouse_name", "address", "city", "country", "contact_name", "contact_position", "contact_phone", "contact_email")
        .from("warehouses")    
        res.status(200).json(warehousesData)    
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: "Not Found: Couldn't find any warehouses."
          })
    }
}

exports.createWarehouse = async (req, res) => {
    try{
        if (!req.body.warehouse_name || 
            !req.body.address || 
            !req.body.city || 
            !req.body.country || 
            !req.body.contact_name ||
            !req.body.contact_position ||
            !req.body.contact_phone ||
            !req.body.contact_email) {
            return res.status(400).json({
                status: 400,
                message: "Please make sure to provide a warehouse name, address, city, country, contact name, contact position, contact phone and contact email fields in a request"
              });
          }
        let timestamp = new Date().toJSON().slice(0, 19)
        const newWarehouse = {...req.body, id: uuid.v4(), created_at: timestamp, updated_at: timestamp}
        
        const result = await knex("warehouses").insert(newWarehouse);
        const createdWarehouse = await knex("warehouses").where({"warehouses.id": newWarehouse.id})
        return res.status(201).json(createdWarehouse)
    } catch {
        return res.status(500).json({status: 500, message: "Unable to create warehouse"})
    }
}

exports.readSingleWarehouse = async (req, res) => {
    try{
        const warehouseData = await knex.select("*").from("warehouses").where({id: req.params.id})
        return res.json(warehouseData[0])    
    } catch (error) {
        return res.status(404).json( { status: 400, message: "Coundn't find the warehouse you were looking for" } )    
    }
}

exports.updateSingleWarehouse = async (req, res) => {
    try{
        if (!req.body.warehouse_name || 
            !req.body.address || 
            !req.body.city || 
            !req.body.country || 
            !req.body.contact_name ||
            !req.body.contact_position ||
            !req.body.contact_phone ||
            !req.body.contact_email) {
            return res.status(400).json({
                status: 400,
                message: "Please make sure to provide a warehouse name, address, city, country, contact name, contact position, contact phone and contact email fields in a request"
            });
          }
        const timestamp = new Date().toJSON().slice(0, 19)
        const changedWarehouse = {...req.body, updated_at: timestamp}
        const result = await knex("warehouses").where({ id: req.params.id }).update(changedWarehouse);
        const updatedWarehouse = await knex("warehouses").where({id: req.params.id})
        return res.status(201).json(updatedWarehouse[0])
    } catch (error) {
        return res.status(500).json({ status: 500, message: "Unable to update warehouse"})
    }
}

exports.deleteSingleWarehouse = async (req, res) => {
    try {
        result = await knex("warehouses").where({id: req.params.id}).del()
        return res.status(200).json({status: 204, message: "Warehouse successfully deleted"})
        //if status is 204, message doesn't show up
    }
    catch {
        return res.status(404).json({ status: 404, message: "Couldn't find the warehouse you're looking for"})
    }
}

exports.readSingleWarehouseInventory = async (req, res) => {
    try{
        const inventories = await 
        knex("inventories")
        .where({warehouse_id : req.params.id})
        return res.status(200).json(inventories)

    } catch (error) {
        return res.status(404).json({status: 404, message: "Couldn't find the information you requested"})
    }
}



