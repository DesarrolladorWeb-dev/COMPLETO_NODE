const express = require("express");
const cors = require("cors");
const { socketController } = require("../sockets/controller");




class Server {
  constructor() {
    this.app = express(); //cuando se crae una instancia se ejecuta esta linea
    this.port = process.env.PORT;
    this.server = require('http').createServer(this.app);//aqui le envio mi servidor de express
    this.io = require('socket.io')(this.server); //io toda la info que sus sokets conectados
    this.paths = {}
    //Midelware
    this.middelwares();

    // Rutas de mi aplicacion
    this.routes();

    // Sockets
    this.socket();

  }
  

  middelwares() {
    // CORS
    this.app.use(cors());


    // Directorio Public - para  nuestros clientes
    this.app.use(express.static("public")); // se mostrara el index de aqui y no se mostrar la ruta de abajo que es  '/' por eso se cambio /api

    

  }

  routes() {
    // this.app.use(this.paths.auth, require("../routes/auth"));
  }
  socket(){
    this.io.on("connection",socketController);
  }



  listen() {
    this.server.listen(this.port, () => { //utilizamos server como servidor
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
