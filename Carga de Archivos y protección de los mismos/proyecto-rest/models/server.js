const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const fileUpload = require('express-fileupload')
// ------------
require("../middlewares/oauth-google");
const session = require("express-session");
const passport = require("passport");
const app = express();

// enviar informacion al index :
app.use(express.json());


function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

class Server {
  constructor() {
    this.app = express(); //cuando se crae una instancia se ejecuta esta linea
    this.port = process.env.PORT;
    this.paths = {
      categorias: '/api/categorias',
      productos: '/api/productos',
      buscar:     '/api/buscar', 
      auth:     '/api/auth', 
      usuarios : '/api/usuarios',
      uploads : '/api/uploads',

    }
    //this.usuariosPath = "/api/usuarios"; //para que pueda saber las rutas que tenemo
    

    // conectar a base de datos
    this.conectarDB();
    //Midelware
    this.middelwares();

    // Rutas de mi aplicacion
    this.routes();
  }
  async conectarDB() {
    await dbConnection(); // no necesita ningun argumento
  }

  middelwares() {
    // CORS
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json()); //TODO recordar los entreparentesis en json()

    // Directorio Public
    this.app.use(express.static("public")); // se mostrara el index de aqui y no se mostrar la ruta de abajo que es  '/' por eso se cambio /api

    // Fileupload - Carga de archivos
    this.app.use(fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath : true //para crear la carpeta si no existe
    }));

  }

  routes() {
    // Ahora el path es /api/usuarios
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.productos, require("../routes/productos"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios")); //ahora que voy a cargar aqui
    // this.app.use('../routes/googleOut')

    this.app.use(
      session({
        secret: "maysecret",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, //pasar a false
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    this.app.get(
      "/auth/google",
      passport.authenticate("google", { scope: ["email", "profile"] })
    );

    // dsdsd
    this.app.get(
      "/auth/google/callback",
      passport.authenticate("google", {
        successRedirect: "/auth/protected",
        failureRedirect: "/auth/google/failure",
      })
    );

    // dsdsd
    this.app.get("auth/google/failure", (req, res) => {
      res.send("Something went wrong");
    });
    // dsdsd
    // this.app.get("/auth/protected", isLoggedIn, (req, res) => {
    //   console.log(req.user);
    //   const {displayName} = req.user.profile
    //   let token = req.user.accessToken;
    //   res.send(`Hello ${displayName} <br> su token es:    ${token}  `);
    // });
    
    this.app.set('view engine', 'ejs');

    this.app.get("/auth/protected", isLoggedIn, (req, res) => {
      const { displayName , picture, email } = req.user.profile;
      console.log(req.user)
      const token = req.user.accessToken;
      res.render('protected', { displayName,picture, email , token });
    });

    // dsdsd
    this.app.use("/auth/logout", (req, res) => { // *  /auth/logout
      req.session.destroy();
      res.send(`See you again`); // para cerrar la session y cuando entras aqui y cuando regresas a protect ya dira Unaythorized
    });

    this.app.post("/api/postToken", (req, res) => {
      const token = req.body.token;
      res.json({ message: "Token received" });
    });


  }

    

  listen() {
    this.app.listen(this.port, () => {
      //para que sean variable global en la clase
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
