const db = require("./dB_connection");

async function readCostumers() {
  let result = await db.sequelize.query("SELECT idCustomer, user, fullname, email, phone, shipping_address, password, rol FROM customers", { type: db.sequelize.QueryTypes.SELECT }).then(results => {
    return results;
  });
  return await result;
}

async function readCostumersId(idCustomer) {
  let result = await db.sequelize
    .query("SELECT user, fullname, email, phone, shipping_address, password FROM customers WHERE idCustomer= :id", { replacements: { id: `${idCustomer}` }, type: db.sequelize.QueryTypes.SELECT })
    .then(results => {
      if (results.length == 0) {
        return "Id no encontrado";
      } else {
        return results;
      }
    });
  return await result;
}

async function readCostumersUserEmail(userCustomer, emailCustomer) {
  let result = await db.sequelize
    .query("SELECT user, email FROM customers WHERE user= :user or email= :email", { replacements: { user: `${userCustomer}`, email: `${emailCustomer}` }, type: db.sequelize.QueryTypes.SELECT })
    .then(results => {
      console.log(results);
      if (results.length == 0) {
        return "no encontrado";
      } else {
        return results;
      }
    });
  return await result;
}

async function createCustomer(user, fullname, email, phone, shipping_address, password) {
  let result = await db.sequelize
    .query("INSERT INTO customers (user, fullname, email, phone, shipping_address, password) VALUES (?,?,?,?,?,?)", { replacements: [user, fullname, email, phone, shipping_address, password] })
    .then(results => {
      return results;
    });
  return await result;
}

async function readCostumersUserEmailPassword(userCustomer, emailCustomer, passwordCustomer) {
  let result = await db.sequelize
    .query("SELECT idCustomer, user, fullname, email, phone, shipping_address, password, rol FROM customers WHERE (user= :user OR email= :email) AND password= :password", {
      replacements: { user: `${userCustomer}`, email: `${emailCustomer}`, password: `${passwordCustomer}` },
      type: db.sequelize.QueryTypes.SELECT
    })
    .then(results => {
      if (results.length == 0) {
        return "user/email o password invalid";
      } else {
        return results;
      }
    });
  return await result;
}

module.exports = {
  readCostumers,
  readCostumersId,
  createCustomer,
  readCostumersUserEmail,
  readCostumersUserEmailPassword
};
