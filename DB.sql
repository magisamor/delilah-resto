DROP DATABASE DELILAH;
CREATE DATABASE DELILAH;

USE DELILAH;

DROP TABLE IF EXISTS CUSTOMERS;
DROP TABLE IF EXISTS PRODUCTS;
DROP TABLE IF EXISTS ORDERS;
DROP TABLE IF EXISTS ORDERS_PRODUCTS;

CREATE TABLE CUSTOMERS(
    idCustomer INT PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR (255) NOT NULL,
    fullname VARCHAR (255) NOT NULL,
    email VARCHAR (255) NOT NULL,
    phone VARCHAR (255) NOT NULL,
    shipping_address VARCHAR (255) NOT NULL,
    password VARCHAR (255) NOT NULL,
    rol SET('NO_ADMIN','ADMIN') NOT NULL DEFAULT 'NO_ADMIN'
);

CREATE TABLE PRODUCTS(
    idProduct INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR (255) NOT NULL,
    description VARCHAR (255) NULL,
    cost DOUBLE NOT NULL,
    url VARCHAR (255) NULL
);

CREATE TABLE ORDERS(
    idOrder INT PRIMARY KEY AUTO_INCREMENT,
    idCustomer INT,
    state SET ('NUEVO', 'CONFIRMADO', 'PREPARANDO', 'ENVIANDO', 'CANCELADO', 'ENTREGADO') NOT NULL DEFAULT 'NUEVO',
    time TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description VARCHAR (255) NOT NULL,
    payment SET ('EFECTIVO','TARJETA') NOT NULL DEFAULT 'EFECTIVO',
    total DOUBLE NOT NULL,
    FOREIGN KEY (idCustomer) REFERENCES CUSTOMERS(idCustomer)
);

CREATE TABLE ORDERS_PRODUCTS(
    id INT PRIMARY KEY AUTO_INCREMENT,
    idOrder INT,
    idProduct INT,
    amount INT NOT NULL,
    FOREIGN KEY (idOrder) REFERENCES ORDERS (idOrder),
    FOREIGN KEY (idProduct) REFERENCES PRODUCTS (idProduct)
);

INSERT INTO CUSTOMERS (user, fullname, email, phone, shipping_address, password, rol) VALUES 
("alejo", "Alejo Gomez", "alejo@gmail.com", "3515555555", "Av. Siempreviva 1234", "1234", "ADMIN");
INSERT INTO CUSTOMERS (user, fullname, email, phone, shipping_address, password) VALUES 
("ana", "Ana Centurion", "ana@gmail.com", "3515555556", "Av. Siempreviva 1236", "4567");
INSERT INTO CUSTOMERS (user, fullname, email, phone, shipping_address, password) VALUES 
("leon", "León Gomez Centurion", "leon@gmail.com", "3515555557", "Av. Siempreviva 1238", "8910");

INSERT INTO PRODUCTS VALUES (NULL, 
"Hamburguesa Doble con Cheddar y papas", 
"Dos medallones de carne con cheddar y bacon entre 2 panes Brioche y con una porción de papas fritas", 
360, 
"https://via.placeholder.com/732");

INSERT INTO PRODUCTS VALUES (NULL, 
"Ensalada César con pollo", 
"Ensalada de lechuga romana con salsa césar, crutones tostados, pollo a la plancha y queso parmesano", 
300, 
"https://via.placeholder.com/237");

INSERT INTO PRODUCTS VALUES (NULL, 
"Coca cola 500ml", 
"Gaseosa de 500ml sabor cola, marca Coca-Cola, envase descartable", 
60, 
"https://via.placeholder.com/666");

INSERT INTO PRODUCTS VALUES (NULL, 
"Pizza grande de muzzarella", 
"Pizza grande de muzzarella de 8 porciones", 
400, 
"https://via.placeholder.com/444");

INSERT INTO PRODUCTS VALUES (NULL, 
"Pizza grande de jamón y ananá", 
"Pizza grande de jamón y ananá de 8 porciones", 
450, 
"https://via.placeholder.com/999");

INSERT INTO PRODUCTS VALUES (NULL, 
"Trío perfecto", 
"Dos botellas de Coca-Cola no retornable 2000ml + Fernet Branca de 750ml + Bolsa de hielo", 
550, 
"https://via.placeholder.com/888");


-- Crear order

INSERT INTO orders VALUES ('1', '2', 'NUEVO', '1x HambDobPapas, 2x Coca600', 'TARJETA', '480');
INSERT INTO orders VALUES ('2', '2', 'ENVIANDO', CURRENT_TIMESTAMP, '1x HambDobPapas, Trío perfecto', 'TARJETA', '910');