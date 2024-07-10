const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
  constructor() {
    this.app = express(); //cuando se crae una instancia se ejecuta esta linea
    this.port = process.env.PORT;
    this.usuariosPath = '/api/usuarios'  //para que pueda saber las rutas que tenemo
    // conectar a base de datos
    this.conectarDB();
    //Midelware
    this.middelwares();

    // Rutas de mi aplicacion
    this.routes();
  }
  async conectarDB(){
    
    await dbConnection(); // no necesita ningun argumento
  }

  middelwares(){
    // CORS 
    this.app.use(cors())

    //Lectura y parseo del body
    this.app.use(express.json()) //TODO recordar los entreparentesis en json()

    // Directorio Public
    this.app.use(express.static('public')) // se mostrara el index de aqui y no se mostrar la ruta de abajo que es  '/' por eso se cambio /api
  } 

  routes() {
    // Ahora el path es /api/usuarios
    this.app.use(this.usuariosPath , require('../routes/usuarios')) //ahora que voy a cargar aqui
  }

  listen() {
    this.app.listen(this.port, () => { //para que sean variable global en la clase
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
