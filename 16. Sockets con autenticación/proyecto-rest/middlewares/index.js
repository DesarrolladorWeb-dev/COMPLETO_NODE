const validarCampos         = require('../middlewares/validar-campos');
const validarJWT            = require("../middlewares/validar-roles");
const validaRoles           = require("../middlewares/valida-jwt");
const validarArchivo  = require("../middlewares/validar-archivo");

module.exports = {
    ...validarCampos, 
    ...validarJWT,
    ...validaRoles,
    ...validarArchivo,
}