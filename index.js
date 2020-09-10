const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const products = require("./products");
const customers = require("./customers");
const orders = require("./orders");
const key = require("./config");
let noImageAvailable = "https://image.shutterstock.com/image-vector/no-image-available-sign-internet-260nw-261719003.jpg";
const puerto = 3000;

const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const verifyToken = jwt.verify(token, key.passwordToken);
    if (verifyToken) {
      req.user = verifyToken;
      req.email = verifyToken;
      return next();
    }
  } catch (err) {
    res.status(401).json({ error: "Error al validar usuario" });
  }
};

function validateRol(req, res, next) {
  var privilege = server.locals.userRol.find(userRol => userRol.user);
  if (privilege.rol != "ADMIN") {
    res.status(403).json("no posee privilegios");
  } else {
    next();
  }
}

async function validateProduct(req, res, next) {
  const { name, description, cost, url } = req.body;
  if (!name || !cost) {
    res.status(400).json("faltan datos");
  } else {
    let getProductName = await products.readProductName(name);
    if (getProductName != "name no encontrado") {
      res.status(409).json("Ya se encuentra un producto registrado con este name");
    } else {
      server.locals.name = name;
      server.locals.cost = cost;
      if (!url) {
        server.locals.url = noImageAvailable;
      } else {
        server.locals.url = url;
      }
      if (!description) {
        server.locals.description = "no description";
      } else {
        server.locals.description = description;
      }
      next();
    }
  }
}

async function validateIdProduct(req, res, next) {
  const { name, description, cost, url } = req.body;
  server.locals.idProduct = Number(req.params.id);
  let getProductId = await products.readProductId(req.params.id);
  if (getProductId == "id no encontrado") {
    res.status(404).json("no se encuentra un plato registrado con ese id");
  } else {
    let productProperties = getProductId.find(product => product.name);
    if (!name) {
      server.locals.name = productProperties.name;
    } else {
      if (productProperties.name != name) {
        let getProductName = await products.readProductName(name);
        if (getProductName != "name no encontrado") {
          res.status(409).json("Ya se encuentra un producto registrado con este name");
        } else {
          server.locals.name = name;
        }
      }
    }
    !description ? (server.locals.description = productProperties.description) : (server.locals.description = description);
    !cost ? (server.locals.cost = productProperties.cost) : (server.locals.cost = cost);
    !url ? (server.locals.url = productProperties.url) : (server.locals.url = url);
    server.locals.getProductId = getProductId;
    next();
  }
}

async function validateCustomer(req, res, next) {
  const { user, fullname, email, phone, shipping_address, password } = req.body;
  let getCustomer = await customers.readCostumersUserEmail(req.body.user, req.body.email);
  if (!user || !fullname || !email || !phone || !shipping_address || !password) {
    res.status(400).json("Datos incompletos/incorrectos, favor de validar nuevamente.");
  } else {
    if (getCustomer != "No encontrado") {
      res.status(409).json("Usuario o email ya registrados en el sistema");
    } else {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(email).toLowerCase()) == false) {
        res.status(400).json("Formato de email incorrecto");
      } else {
        server.locals.user = user;
        server.locals.fullname = fullname;
        server.locals.email = email;
        server.locals.phone = phone;
        server.locals.shipping_address = shipping_address;
        server.locals.password = password;
        next();
      }
    }
  }
}

async function customerInformation(req, res, next) {
  let Customer = server.locals.userRol.find(userRol => userRol.user);
  if (Customer.rol == "ADMIN") {
    let getCustomers = await customers.readCostumers();
    server.locals.getCustomerInformation = getCustomers;
  } else {
    let getCustomerId = await customers.readCostumersId(Customer.idCustomer);
    server.locals.getCustomerInformation = getCustomerId;
  }
  next();
}

async function validateIdCustomerOrders(req, res, next) {
  let Customer = server.locals.userRol.find(userRol => userRol.user);
  if (Customer.rol == "ADMIN") {
    let getOrders = await orders.readOrders();
    server.locals.getOrders = getOrders;
  } else {
    let getCustomerOrders = await orders.readCostumersOrders(Customer.idCustomer);
    if (getCustomerOrders == "No tiene pedidos registrados.") {
      res.status(404).json("No tiene pedidos registrados.");
    } else {
      server.locals.getOrders = getCustomerOrders;
    }
  }
  next();
}

async function validateIdOrder(req, res, next) {
  const { newState } = req.body;
  server.locals.idOrder = Number(req.params.id);
  let getOrderId = await orders.readOrderId(req.params.id);
  if (getOrderId == "ID no encontrado") {
    res.status(404).json("No hay pedidos registrados con ese ID");
  } else {
    let orderProperties = getOrderId.find(product => product.idOrder);
    if (!newState) {
      server.locals.newState = orderProperties.state;
    } else {
      if (newState != "CONFIRMADO" && newState != "PREPARANDO" && newState != "ENVIANDO" && newState != "CANCELADO" && newState != "ENTREGADO") {
        res.status(400).json("Estado inválido.");
      } else {
        server.locals.newState = newState;
      }
    }
    next();
  }
}

async function validateIdProductOrder(req, res, next) {
  const { orderProducts, payment } = req.body;
  let array = [];
  orderProducts.forEach(product => {
    array.push(products.readProductId(product.idProduct));
  });
  Promise.all(array).then(respuesta => {
    for (var i = 0; i < respuesta.length; i++) {
      if (respuesta[i] == "ID no encontrado") {
        res.status(404).json("Uno de los platos no esta disponible.");
      }
    }
    return respuesta;
  });
  next();
}

server.use(cors());
server.use(bodyParser.json());

server.get("/products", authenticateUser, async (req, res) => {
  let getProducts = await products.readProducts();
  res.status(200).json(getProducts);
});

server.post("/products", authenticateUser, validateRol, validateProduct, async (req, res) => {
  let postProduct = await products.createProduct(server.locals.name, server.locals.description, server.locals.cost, server.locals.url);
  res.status(201).json("Producto creado con éxito.");
});

server.get("/products/:id", authenticateUser, validateIdProduct, async (req, res) => {
  res.status(200).json(server.locals.getProductId);
});

server.put("/products/:id", authenticateUser, validateRol, validateIdProduct, async (req, res) => {
  let putProduct = await products.updateProduct(server.locals.idProduct, server.locals.name, server.locals.description, server.locals.cost, server.locals.url);
  res.status(200).json("Producto modificado");
});

server.delete("/products/:id", authenticateUser, validateRol, validateIdProduct, async (req, res) => {
  let deleteProduct = await products.deleteProduct(server.locals.idProduct);
  res.status(204).json();
});

server.post("/register", validateCustomer, async (req, res) => {
  let postCustomer = await customers.createCustomer(server.locals.user, server.locals.fullname, server.locals.email, server.locals.phone, server.locals.shipping_address, server.locals.password);
  res.status(201).json("Usuario registrado correctamente.");
});

server.post("/login", async (req, res) => {
  let user = req.body.user;
  let email = req.body.email;
  server.locals.email = req.body.email;
  let postLogin = await customers.readCostumersUserEmailPassword(req.body.user, req.body.email, req.body.password);
  if (postLogin == "User o password invalidos.") {
    res.status(400).json(postLogin);
    return;
  }
  server.locals.userRol = postLogin;
  if (!email) {
    const token = jwt.sign({ user }, key.passwordToken);
    res.status(200).json({ token });
  } else {
    const token = jwt.sign({ email }, key.passwordToken);
    res.status(200).json({ token });
  }
});

server.get("/customers", authenticateUser, customerInformation, async (req, res) => {
  res.status(200).json(server.locals.getCustomerInformation);
});

server.post("/orders", authenticateUser, validateIdProductOrder, async (req, res) => {
  var user = server.locals.userRol.find(userRol => userRol.idCustomer);
  const { orderProducts, payment } = req.body;
  let method = payment.toUpperCase();
  if (method != "EFECTIVO" && method != "TARJETA") {
    res.status(400).json("metodo de pago invalido");
  } else {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let description = await orders.descriptionOrder(orderProducts);
    let total = await orders.totalOrder(orderProducts);
    let postOrder = await orders.createOrder(user.idCustomer, description.reduce(reducer), method, total.reduce(reducer), orderProducts);
    res.status(200).send(`¡Recibimos tu pedido! ${user.fullname}, gracias por pedir a Delilah.`);
  }
});

server.get("/orders", authenticateUser, validateIdCustomerOrders, async (req, res) => {
  res.status(200).json(server.locals.getOrders);
});

server.put("/orders/:id", authenticateUser, validateRol, validateIdOrder, async (req, res) => {
  let putOrder = await orders.updateOrder(server.locals.idOrder, server.locals.newState);
  res.status(200).json("Estado modificado con éxito");
});

server.delete("/orders/:id", authenticateUser, validateRol, validateIdOrder, async (req, res) => {
  let deleteOrder = await orders.deleteOrder(server.locals.idOrder);
  res.status(200).json("Pedido eliminado");
});


server.listen(puerto, () => {
  console.log(`Server iniciado en puerto ${puerto}, puede comenzar a operar.`);
});
