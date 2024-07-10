const { Router } = require("express");
const { check } = require("express-validator");

const { login } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");


const router = Router();

router.post("/login",[
    check('correo','El correo es obligatorio').isEmail(), //necesitamos validar campos para que funcione no solo esto
    check('password','La contraseña es obligatoria').not().isEmpty(), //se asegura que exista la contraseña
    validarCampos
], login ); //solo login porque en el server.js lo completa con

module.exports = router;