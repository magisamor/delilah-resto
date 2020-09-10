const db = require("./dB_connection");

async function readProducts() {
  let result=await db.sequelize.query("SELECT idProduct, name, description, cost, url FROM products", 
  { type: db.sequelize.QueryTypes.SELECT })
  .then(results => {
    return results;
  });
  return await result;
}

async function readProductsForOrder() {
  let result=await db.sequelize.query("SELECT idProduct, name, cost, FROM products", 
  { type: db.sequelize.QueryTypes.SELECT })
  .then(results => {
    return results;
  });
  return await result;
}

async function readProductId(idProduct) {
  let result=await db.sequelize.query("SELECT idProduct, name, description, cost, url FROM products WHERE idProduct= :id", 
  { replacements: { id: `${idProduct}`}, type: db.sequelize.QueryTypes.SELECT })
  .then(results => {
    if(results.length==0){
      return "id no encontrado";
    }else{
      return results;
    }
    
  });
  return await result;
}

async function readProductName(nameProduct) {
  let result=await db.sequelize.query("SELECT idProduct, name, description, cost, url FROM products WHERE name= :name", 
  { replacements: { name: `${nameProduct}`}, type: db.sequelize.QueryTypes.SELECT })
  .then(results => {
    if(results.length==0){
      return "name no encontrado";
    }else{
      return results;
    }
    
  });
  return await result;
}

async function createProduct(name, description, cost, url) {
  let result=await db.sequelize.query("INSERT INTO products (name, description, cost, url) VALUES (?,?,?,?)", 
  {replacements:[name, description, cost, url]})
  .then(results => {
    return results;
  });
  return await result;
}

async function updateProduct(idProduct, name, description, cost, url) {
  let result=await db.sequelize.query("UPDATE products SET name = :nombre, description = :descripcion, cost = :costo, url = :link WHERE idProduct= :id", 
  {replacements:{id: `${idProduct}`, nombre: `${name}`, descripcion: `${description}`, costo: `${cost}`, link: `${url}`}})
  .then(results => {
    console.log(results);
    return results;
  });
  return await result;
}

async function deleteProduct(idProduct) {
  let result=await db.sequelize.query("DELETE FROM products WHERE idProduct= :id", 
  {replacements:{id: `${idProduct}`}})
  .then(results => {
    console.log(results);
    return results;
  });
  return await result;
}

module.exports = { 
  readProducts,
  readProductsForOrder,
  readProductId,
  readProductName,
  createProduct,
  updateProduct,
  deleteProduct 
};