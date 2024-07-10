const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignin , renovarToken } = require("../controllers/auth");
const { validarCampos , validarJWT } = require("../middlewares");


const router = Router();




router.post("/login",[
    check('correo','El correo es obligatorio').isEmail(), //necesitamos validar campos para que funcione no solo esto
    check('password','La contraseña es obligatoria').not().isEmpty(), //se asegura que exista la contraseña
    validarCampos
], login ); //solo login porque en el server.js lo completa con

// /auth/protected
router.post("/google",[
    check('token','El token es necesario').not().isEmpty(), //necesitamos validar campos para que funcione no solo esto
    validarCampos
], googleSignin ); //solo login porque en el server.js lo completa con


// SOCKET
router.get("/", validarJWT , renovarToken); //solo login porque en el server.js lo completa con


module.exports = router;