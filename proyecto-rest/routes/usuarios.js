const { Router } = require("express");
const { usuariosGet,usuariosPut,usuariosDelete,usuariosPatch,usuariosPost} = require ('../controllers/usuarios');
const { check } = require("express-validator");
const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');



const router = Router();

// se borran las /"api" porque ahora uso el path desde el app  : /api/usuarios

router.get("/", usuariosGet);

router.put("/:id", [
    check('id', 'No es un ID valido').isMongoId(), //tiene que ser un mongoid en el url 
    check('id').custom(existeUsuarioPorId), //tomo el id y se lo mando a la funcion
    check('rol').custom( esRoleValido ), 
    validarCampos //validamos los campos sino se queda aqui, para que no siga si hay error
],usuariosPut);  //:id es el parametro que se le envia

router.post("/", [
    // 'correo'  - lo que quiero revisar
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),  //empty si esta vacio
    check('password', 'El password debe de ser mas ded 6 letras').isLength({min:6}), 
    check('nombre', 'El nombre es obligatorio').not().isEmpty(), 
    check('correo', 'El correo no es válido').isEmail(), // que campo del body quiero revisar
    //check('rol', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']), // si no es ninguno de estos dos es incorrecto
    check('correo').custom( emailExiste ),  //para ejecutar la funcion de la consulta a la base de datos y traer solo un email
    check('rol').custom( esRoleValido ), 

    validarCampos //aqui se montrara todos los errores
], usuariosPost); //donde esta el [] son los midelware

router.delete("/:id",[
    check('id', 'No es un ID valido').isMongoId(), 
    check('id').custom(existeUsuarioPorId), 
    validarCampos
], usuariosDelete);

router.patch("/", usuariosPatch);

module.exports = router;
