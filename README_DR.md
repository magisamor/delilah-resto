# README para API Delilah Restó

Pasos requeridos para inicializar el servidor:

  - Iniciar Apache y MySQL en servidor XAMPP.
  - Importar las queries del archivo DB.sql en sql. 
    - Crear las tablas y sus relaciones.
    - 1 Usuario Admin (alejo).
    - 2 Usuarios no admin.
  - git clone https://github.com/magisamor/delilah-resto.git
    - npm install
    - node index.js (se conecta al puerto 3000).

# Checklist

##### Poder registrar un nuevo usuario.
- Desde postman realizar un post al endpoint `register` 
    ```sh
        curl --location --request POST 'http://localhost:3000/register' \
        --header 'Content-Type: application/json' \
        --data-raw '{
        "user": "usuario",
        "fullname": "Nombre Apellido",
        "email": "usuario@gmail.com",
        "phone": "3515555555",
        "shipping_address": "Dirección de entrega",
        "password": "1234"
        }'
    ```
    - Si el usuario no esta registrado en la DB , el servidor responderá 201 con un mensaje de "Usuario Registrado".
    - Si falta algunos de los datos, el servidor responderá 404 con un mensaje de "faltan datos".
    - Si el usuario se encuentra ya registrado en la base de datos, el servidor responderá 409 con un mensaje de "user o email registrado".
    - Si el formato del email es erróneo, el servidor responderá 409 con un mensaje de "formato de email incorrecto".

##### Un usuario debe poder listar todos los productos disponibles.
- Acceder con alguna cuenta, ya sea admin o no-admin con un post a `login` para obtener el token.
    ```sh
        curl --location --request POST 'http://localhost:3000/login' \
            --header 'Content-Type: application/json' \
            --data-raw '{
            "user": "alejo",
            "password": "1234"
            }'
    ```
- Obtenido el token, hacemos un get al endoint the `products`.
    ```sh
    curl --location --request GET 'http://localhost:3000/products' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZW1tYSIsImlhdCI6MTU5OTcxNzYzNX0.uQ5C33cPX5YEZQ9PKJ0PthGTGxetjvHkzQrvGHG_sNE' \
    --data-raw ''
    ```
##### Un usuario debe poder generar un nuevo pedido al restaurante con un listado de platos que desea.
- Logueado con alguna cuenta y ya obtenido el token, realizar un post al endpoint de `orders`
    ```sh
        curl --location --request POST 'http://localhost:3000/orders' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZW1tYSIsImlhdCI6MTU5OTcxNzYzNX0.uQ5C33cPX5YEZQ9PKJ0PthGTGxetjvHkzQrvGHG_sNE' \
        --data-raw '{
                "orderProducts": [
             {
                "idProduct": 1,
                "amount": 2
            },
            {
                "idProduct": 2,
                "amount": 3
            },
            {
                "idProduct": 3,
                "amount": 1
            }
        ],
        "payment": "EFECTIVO"
        }'
    ```
-- El valor `idProduct` será el id del producto.
-- El valor `amount` es la cantidad del producto.
-- EL valor `payment` será "EFECTIVO" o "TARJETA".

- Si uno de los idProduct no esta en la base de dato el servidor responderá 404 con un mensaje de "uno de los platos no esta disponible".
- Si uno de los métodos de pago no es el correcto el servidor responderá 400 con el mensaje de "método de pago invalido"
- Si todos los datos están bien, el servidor responderá con 200 con el mensaje de "¡Recibimos tu pedido! ${user.fullname}, gracias por pedir a Delilah.".

##### El usuario con roles de administrador debe poder actualizar el estado del pedido. 
- Logueado con la cuenta de ADMIN y ya obtenido el token, realizar un post al endpoint de `orders`/ID 
    ```sh
        curl --location --request POST 'http://localhost:3000/orders/2' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZW1tYSIsImlhdCI6MTU5OTcxNzYzNX0.uQ5C33cPX5YEZQ9PKJ0PthGTGxetjvHkzQrvGHG_sNE' \
        --data-raw '{ "newState": "CONFIRMADO" }'
    ```
    -- Los estados de `newStatus` puede ser : 
    - CONFIRMADO.
    - PREPARANDO.
    - ENVIADO.
    - CANCELADO.
    - ENTREGADO.

    -- Si el :id no esta registrado en la DB, el servidor responderá 404 con el mensaje de "no hay pedido registrado con ese id".
    -- El estado debe ser uno de los permitidos, en caso contrario el servidor responderá 400 con el mensaje "estado no valido". Nota: el estado `NUEVO` no es permitido ya que viene por defecto cuando se realiza un nuevo pedido.
    -- Si el usuario NO es admin el servidor responderá 403 con el mensaje de "no posee privilegios".
    -- Si todos los datos están bien, el servidor responderá con 200 con el mensaje de "Estado modificado con éxito". 
    
##### Un usuario con rol de administrador debe poder realizar las acciones de creación, edición y eliminación de recursos de productos (CRUD de productos).

- El usuario NO_ADMIN solo tendrá acceso a `GET products` y `GET products/:id`. Para las demás rutas el servidor responderá 403 con el mensaje "no posee privilegios".
- Como usuario ADMIN:
    - Crear producto:  
       - Si faltan los datos name y cost el servidor responderá 400 con el mensaje "faltan datos".
        - Si el name ya se encuentra registrado en la DB el servidor responderá 409 con el mensaje de "Ya se encuentra un producto registrado con este name". 
        - En caso de que falten los datos de description y url, estos se definen con un valor default. Description: "no description" y URL : "link de no imagen".
        - Si todos los datos están bien, el servidor responderá con 200 con el mensaje de "Producto creado con éxito".
         
    ```sh
        curl --location --request POST 'http://localhost:3000/products' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZW1tYSIsImlhdCI6MTU5OTcxNzYzNX0.uQ5C33cPX5YEZQ9PKJ0PthGTGxetjvHkzQrvGHG_sNE' \
        --data-raw '{
            "name": "nuevo plato",
            "description": "descripcion del plato",
            "cost": 200,
            "url": "link de imagen del plato"
        }'
    ```
    - Listar items:
        - Realizar un get al endoint the `products`.
    ```sh
    curl --location --request GET 'http://localhost:3000/products' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZW1tYSIsImlhdCI6MTU5OTcxNzYzNX0.uQ5C33cPX5YEZQ9PKJ0PthGTGxetjvHkzQrvGHG_sNE' \
    --data-raw ''
    ```
    - Eliminar producto: 
        - Realizar un `delete` al endpoint especificando el id del producto.
    ```sh
        curl --location --request DELETE 'http://localhost:3000/products/2' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZW1tYSIsImlhdCI6MTU5OTcxNzYzNX0.uQ5C33cPX5YEZQ9PKJ0PthGTGxetjvHkzQrvGHG_sNE' \
        --data-raw '' 
    ```
    - Editar producto:
        - Realizar un put al endpoint de `products`/id.
        - Si el name se encuentre registrado en la DB el servidor responderá 409 con el mensaje de "Ya se encuentra un producto registrado con este name". En caso contrario el servidor responderá 200 con el mensaje de "Producto modificado".
        
    ```sh
        curl --location --request PUT 'http://localhost:3000/products/2' \
        --header 'Content-Type: application/json' \
        --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiZW1tYSIsImlhdCI6MTU5OTcxNzYzNX0.uQ5C33cPX5YEZQ9PKJ0PthGTGxetjvHkzQrvGHG_sNE' \
        --data-raw '{
            "name": "Nombre del producto",
            "description": "descripción",
            "cost": 100,
            "url": "link"
        }'
    ```
##### Un usuario sin roles de administrador no debe poder crear, editar o eliminar un producto, ni editar o eliminar un pedido. Así como no debe poder acceder a informaciones de otros usuarios.

- Eliminar un pedido: realizar un delete al endpoint http://127.0.0.1:3000/orders/:id.
- Información de usuarios: realizar un get al endpoint http://127.0.0.1:3000/customers.
- Si el usuario es ADMIN puede acceder a la información de todos los usuarios. En caso contrario, solo podra acceder a su propia información.

