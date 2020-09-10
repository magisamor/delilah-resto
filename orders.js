const db = require("./dB_connection");

async function totalOrder(orderProducts) {
  let array = [];
  await orderProducts.forEach(product => {
    array.push(
      db.sequelize.query("SELECT name, cost FROM products WHERE idProduct = :id", 
      { replacements: { id: `${product.idProduct}` }, type: db.sequelize.QueryTypes.SELECT })
      .then(results => {
        let cost = results[0].cost * product.amount;
        return cost;
      })
    );
  });
  return await Promise.all(array)
    .then(respuesta => {
      return respuesta;
    })
    .catch(err => {
      console.log(err);
    });
}

async function descriptionOrder(orderProducts) {
  let array = [];
  await orderProducts.forEach(product => {
    array.push(
      db.sequelize.query("SELECT name, cost FROM products WHERE idProduct = :id", 
      { replacements: { id: `${product.idProduct}` }, type: db.sequelize.QueryTypes.SELECT })
      .then(results => {
        let description = product.amount + "x" + results[0].name + " ";
        return description;
      })
    );
  });
  return await Promise.all(array)
    .then(respuesta => {
      return respuesta;
    })
    .catch(err => {
      console.log(err);
    });
}

async function createOrder(idCustomer, description, payment, total, orderProducts) {
  let result=await db.sequelize.query("INSERT INTO orders (idCustomer, description, payment, total) VALUES (?,?,?,?)", 
  {replacements:[idCustomer, description, payment, total]})
  .then(results => {
    let idOrderProduct=results[0];
    orderProducts.forEach(product => {
        db.sequelize.query("INSERT INTO orders_products (idOrder, idProduct, amount) VALUES (?,?,?)", 
        { replacements: [idOrderProduct, product.idProduct, product.amount] })
        .then(result2 => {
          return result2;
        })
    });
    return results;
  });
  return await result;
}

async function readOrders() {
  let result=await db.sequelize.query("SELECT orders.state AS ESTADO, orders.time AS HORA, orders.idOrder AS NUMERO, orders.description AS DESCRIPCION, orders.payment AS PAGO, orders.total AS TOTAL, customers.fullname AS USUARIO, customers.shipping_address AS DIRECCION FROM orders INNER JOIN customers ON orders.idCustomer=customers.idCustomer ORDER BY CASE state WHEN 'NUEVO'  THEN '0' WHEN 'CONFIRMADO' THEN '1' WHEN 'PREPARANDO'  THEN '2' WHEN 'ENVIANDO' THEN '3' WHEN 'CANCELADO'  THEN '4' WHEN 'ENTREGADO' THEN '5' ELSE state END, time DESC", 
  { type: db.sequelize.QueryTypes.SELECT })
  .then(results => {
    return results;
  });
  return await result;
}

async function readOrderId(idOrder) {
  let result=await db.sequelize.query("SELECT idOrder, idCustomer, state, time, description, payment, total FROM orders WHERE idOrder= :id", 
  { replacements: { id: `${idOrder}`}, type: db.sequelize.QueryTypes.SELECT })
  .then(results => {
    if(results.length==0){
      return "id no encontrado";
    }else{
      return results;
    }
    
  });
  return await result;
}

async function readCostumersOrders(idCustomer) {
  let result=await db.sequelize.query("SELECT idOrder AS Orden, state AS Estado, time AS Fecha, description AS Detalle, payment AS Forma_de_pago, total as Total FROM orders WHERE idCustomer= :id ORDER BY time DESC", 
  { replacements: { id: `${idCustomer}`}, type: db.sequelize.QueryTypes.SELECT })
  .then(results => {
    if(results.length==0){
      return "no tiene pedidos registrado";
    }else{
      return results;
    }
    
  });
  return await result;
}

async function updateOrder(idOrder, state) {
  let result=await db.sequelize.query("UPDATE orders SET state = :estado WHERE idOrder= :id", 
  {replacements:{id: `${idOrder}`, estado: `${state}`}})
  .then(results => {
    console.log(results);
    return results;
  });
  return await result;
}

async function deleteOrder(idOrder) {
  let result=await db.sequelize.query("DELETE FROM orders WHERE idOrder= :id", 
  {replacements:{id: `${idOrder}`}})
  .then(results => {
    console.log(results);
    return results;
  });
  return await result;
}

module.exports = {
  totalOrder,
  descriptionOrder,
  createOrder,
  readOrders,
  readOrderId,
  readCostumersOrders,
  updateOrder,
  deleteOrder
};