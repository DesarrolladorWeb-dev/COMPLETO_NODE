const validarCampos= require('../middlewares/validar-campos');
const validarJWT= require("../middlewares/validar-roles");
const validaRoles = require("../middlewares/valida-jwt");

module.exports = {
    ...validarCampos, 
    ...validarJWT,
    ...validaRoles,
}