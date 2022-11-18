## Local Installation

```bash
# create database if you haven't already
$ mysql -u root -p
Enter password:
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 8.0.23 MySQL Community Server - GPL

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> CREATE DATABASE instock_db;
Query OK, 1 row affected (0.02 sec)
```

```bash
cd backend
npm install
cp .env.sample .env # edit .env's local dbname, username and password
npm run db:migrate
npm run db:seed
```

## DB Schemas

### `warehouses`

| name               | type               | notes |
| ------------------ | ------------------ | ----- |
| `id`               | PK (uuid)          | (1)   |
| `warehouse_name`   | string, NOT NULL   |       |
| `address`          | string, NOT NULL   |       |
| `city`             | string, NOT NULL   |       |
| `country`          | string, NOT NULL   |       |
| `contact_name`     | string, NOT NULL   |       |
| `contact_position` | string, NOT NULL   |       |
| `contact_email`    | string, NOT NULL   |       |
| `contact_phone`    | string, NOT NULL   |       |
| `last_created`     | datetime, NOT NULL |       |
| `last_updated`     | datetime, NOT NULL |       |

### `inventories`

| name           | type               | notes                      |
| -------------- | ------------------ | -------------------------- |
| `id`           | PK (uuid)          | (1)                        |
| `warehouse_id` | uuid, FK           | References `warehouses.id` |
| `item_name`    | string, NOT NULL   |                            |
| `description`  | string, NOT NULL   |                            |
| `category`     | string, NOT NULL   |                            |
| `status`       | string, NOT NULL   |                            |
| `quantity`     | number, NOT NULL   |                            |
| `last_created` | datetime, NOT NULL |                            |
| `last_updated` | datetime, NOT NULL |                            |

## API Endpoints

### Error Messages

All errors -- user generated or otherwise -- should return an error response in the following format:

```json
{
  "status": 400,
  "message": "Your appropriate message goes here"
}
```

- `status`: returns the appropriate HTTP status starting with 4xx or 5xx
- `message`: an appropriate error message

#### Response codes

- 200 - OK: Everything worked as expected.
- 201 - Created: A new resource was created.
- 204 - No Content: The request was received and understood; no need to send any data back.
- 400 - Bad Request: The request was unacceptable, often due to missing a required parameter.
- 404 - Not Found: The requested resource doesn't exist.
- 500 - Server Error: Server encountered something it didn't expect; unable to complete the request.

### GET `/api/warehouses`

Get information from all warehouses. (ICM-10)
NOTE: you do NOT need to return the inventory associated with warehouses.

- Response returns 200 if successful with the following data as an example:

  ```json
  [
    {
      "id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
      "warehouse_name": "Manhattan",
      "address": "503 Broadway",
      "city": "New York",
      "country": "USA",
      "contact_name": "Parmin Aujla",
      "contact_position": "Warehouse Manager",
      "contact_phone": "+1 (646) 123-1234",
      "contact_email": "paujla@instock.com"
    },
    {
      "id": "5bf7bd6c-2b16-4129-bddc-9d37ff8539e9",
      "warehouse_name": "Washington",
      "address": "33 Pearl Street SW",
      "city": "Washington",
      "country": "USA",
      "contact_name": "Greame Lyon",
      "contact_position": "Warehouse Manager",
      "contact_phone": "+1 (646) 123-1234",
      "contact_email": "glyon@instock.com"
    }
  ]
  ```

### GET `/api/warehouses/:id`

Get a single warehouse (ICM-11)

- Response returns 200 if successful with the following data as an example:

- `/api/warehouses/2922c286-16cd-4d43-ab98-c79f698aeab0`:

  ```json
  {
    "id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
    "warehouse_name": "Manhattan",
    "address": "503 Broadway",
    "city": "New York",
    "country": "USA",
    "contact_name": "Parmin Aujla",
    "contact_position": "Warehouse Manager",
    "contact_phone": "+1 (646) 123-1234",
    "contact_email": "paujla@instock.com"
  }
  ```

- Response returns 404 the ID is not found.
- NOTE: you do NOT need to return the inventory associated with a warehouse.

### GET `/api/warehouses/:id/inventories`

Get inventory for a given warehouse (ICM-23)

- Response returns 404 if warehouse ID is not found
- Response returns 200 if successful with the following data as an example:

- `/api/warehouses/2922c286-16cd-4d43-ab98-c79f698aeab0/inventories`:

  ```json
  [
    {
      "id": "9b4f79ea-0e6c-4e59-8e05-afd933d0b3d3",
      "warehouse_id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
      "item_name": "Television",
      "description": "This 50\", 4K LED TV provides a crystal-clear picture and vivid colors.",
      "category": "Electronics",
      "status": "In Stock",
      "quantity": 500
    },
    {
      "id": "83433026-ca32-4c6d-bd86-a39ee8b7303e",
      "warehouse_id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
      "item_name": "Gym Bag",
      "description": "Made out of military-grade synthetic materials, this gym bag is highly durable, water resistant, and easy to clean.",
      "category": "Gear",
      "status": "Out of Stock",
      "quantity": 0
    }
  ]
  ```

### POST `/api/warehouses`

Add a new warehouse. (ICM-12)

- Request body should have the following properties as an example:
  ```json
  {
    "warehouse_name": "Chicago",
    "address": "3218 Guess Rd",
    "city": "Chicago",
    "country": "USA",
    "contact_name": "Jameson Schuppe",
    "contact_position": "Warehouse Manager",
    "contact_phone": "+1 (919) 797-2875",
    "contact_email": "jschuppe@instock.com"
  }
  ```
- Response returns 400 if unsuccessful because of missing properties in the request body
- Response returns 201 if successful with the JSON object that was created as an example:
  ```json
  {
    "id": "81798ecb-33ae-49f1-bd77-56f1a0b7eb2b",
    "warehouse_name": "Chicago",
    "address": "3218 Guess Rd",
    "city": "Chicago",
    "country": "USA",
    "contact_name": "Jameson Schuppe",
    "contact_position": "Warehouse Manager",
    "contact_phone": "+1 (919) 797-2875",
    "contact_email": "jschuppe@instock.com"
  }
  ```

### PUT `/api/warehouses/:id`

Edit a warehouse, given its ID. (ICM-14)

- Request body should have the following properties as an example:

- `/api/warehouses/2922c286-16cd-4d43-ab98-c79f698aeab0/inventories`:

  ```json
  {
    "warehouse_name": "Brooklyn",
    "address": "918 Morris Lane",
    "city": "Brooklyn",
    "country": "USA",
    "contact_name": "Parmin Aujla",
    "contact_position": "Warehouse Manager",
    "contact_phone": "+1 (646) 123-1234",
    "contact_email": "paujla@instock.com"
  }
  ```

- Response returns 404 if warehouse ID is not found
- Response returns 200 if successful with the JSON object that was created as an example:
  ```json
  {
    "id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
    "warehouse_name": "Brooklyn",
    "address": "918 Morris Lane",
    "city": "Brooklyn",
    "country": "USA",
    "contact_name": "Parmin Aujla",
    "contact_position": "Warehouse Manager",
    "contact_phone": "+1 (646) 123-1234",
    "contact_email": "paujla@instock.com"
  }
  ```
- NOTE: Because it's a PUT request, the request body replaces the resource in its entirety.
- NOTE: You can not replace the ID.

### DELETE `/api/warehouses/:id`

Delete a warehouse, given its ID. (ICM-15)

- Response returns 404 if warehouse ID is not found
- Response returns 204 if successfully deleted; no response body needed

### GET `/api/inventories/:id`

Get a single item, given its inventory ID. (ICM-22)

- Response returns 200 if successful with the following data as an example:

- `/api/inventories/9b4f79ea-0e6c-4e59-8e05-afd933d0b3d3`:

  ```json
  {
    "id": "9b4f79ea-0e6c-4e59-8e05-afd933d0b3d3",
    "warehouse_id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
    "item_name": "Television",
    "description": "This 50\", 4K LED TV provides a crystal-clear picture and vivid colors.",
    "category": "Electronics",
    "status": "In Stock",
    "quantity": 500
  }
  ```

- Response returns 404 the ID is not found.

### POST `/api/inventories`

Create a new inventory item. (ICM-24)

- Request body should have the following properties as an example:
  ```json
  {
    "warehouse_id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
    "item_name": "Paper Towels",
    "description": "Made out of military-grade synthetic materials, these paper towels are highly flammable, yet water resistant, and easy to clean.",
    "category": "Gear",
    "status": "Out of Stock",
    "quantity": 0
  }
  ```
- Response returns 400 if unsuccessful because of missing properties in the request body
- Response returns 400 if the `warehouse_id` value does not exist in the `warehouses` table
- Response returns 201 if successful with the JSON object that was created:
  ```json
  {
    "id": "273a81bb-5ab2-492d-bc88-8136a51c29f9",
    "warehouse_id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
    "item_name": "Paper Towels",
    "description": "Made out of military-grade synthetic materials, these paper towels are highly flammable, yet water resistant, and easy to clean.",
    "category": "Gear",
    "status": "Out of Stock",
    "quantity": 0
  }
  ```

### PUT `/api/inventories/:id`

Edit an inventory item, given its ID. (ICM-25)

- Request body should have the following properties as an example:

- `/api/inventories/9b4f79ea-0e6c-4e59-8e05-afd933d0b3d3`

  ```json
  {
    "warehouse_id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
    "item_name": "Television",
    "description": "This 50\", 4K LED TV provides a crystal-clear picture and vivid colors.",
    "category": "Electronics",
    "status": "In Stock",
    "quantity": 10000
  }
  ```

- Response returns 404 if inventory ID is not found
- Response returns 200 if successful with the JSON object that was created as an example:
  ```json
  {
    "id": "9b4f79ea-0e6c-4e59-8e05-afd933d0b3d3",
    "warehouse_id": "2922c286-16cd-4d43-ab98-c79f698aeab0",
    "item_name": "Television",
    "description": "This 50\", 4K LED TV provides a crystal-clear picture and vivid colors.",
    "category": "Electronics",
    "status": "In Stock",
    "quantity": 10000
  }
  ```
- NOTE: Because it's a PUT request, the request body replaces the resource in its entirety.
- NOTE: You can not replace the ID.

### DELETE `/api/inventories/:id`

Delete an item, given its ID. (ICM-26)

- Response returns 404 if inventory ID is not found
- Response returns 204 if successfully deleted; no response body needed

### Diving Deeper #1: Sorting

Implementing sorting (ICM-28)

- To implement sorting, build your API to allow two query parameters: `sort_by` and `order_by`.
  - `sort_by` takes the column name as a value.
  - `order_by` can be one of two values: `asc` or ascending, or `desc` for descending. `order_by` is optional and defaults to `asc`.
- This feature applies to all columns in all Warehouse and Inventory GET requests.
- Examples:

  - `GET /api/warehouses?sort_by=warehouse_name` - Sorts results by Warehouse name in ascending order
  - `GET /api/warehouses?sort_by=warehouse_name&order_by=asc` - Sorts results by Warehouse name in ascending order
  - `GET /api/warehouses?sort_by=warehouse_name&order_by=desc` - Sorts results by Warehouse name in ascending order
  - `GET /api/inventories?sort_by=inventory_item&order_by=asc` - Sorts results by Inventory item in ascending order

- NOTE: The JIRA task explicitly asks for sorting functionality on the FE AND the backend.

### Diving Deeper #2: Filtering

Implementing filtering (ICM-31)

- To implement filtering, build your API to allow the query parameter: `s`. `s` takes the filter term as a value. Depending on the API, the search term should filter the following fields:

  - `/api/warehouses`: The term should filter the Warehouse, Address, Contact Name, and Contact Information columns.
  - `/api/inventories`: The term should filter the Inventory Item and Category columns.

- When you search for a keyword, it needs to check all fields as mentioned above for matches and should display matching items in the API results.

  - `GET /api/warehouses?s=Seattle` - "Seattle" is a warehouse name and address, so this would match.
  - `GET /api/inventories?s=Accessories` - "Accessories" is an inventory category, so this would match.

- NOTE: While filter terms should be case insensitive in "real life," terms can be case sensitive for now.
- NOTE: While the JIRA task explicitly asks for filtering (search functionality) to be implemented on the FE, think of this as an additional challenge.
