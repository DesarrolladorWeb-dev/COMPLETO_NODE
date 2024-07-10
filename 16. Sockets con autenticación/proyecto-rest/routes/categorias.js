const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares"); //podemos solo tener la carpeta middelware
const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria, 
        actualizarCategoria,
        borrarCategoria } = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");


const router = Router();

// {{url}}/api/categorias


// Obtener todas las categorias - publico
router.get('/',obtenerCategorias)
// Obtener una las categorias - publico
router.get('/:id',[
    check('id', 'No es un id de Mongovalido').isMongoId(),
    check('id').custom( existeCategoriaPorId), //para comprobar ejecutamos la funcion
    validarCampos,
]
, obtenerCategoria)
// Crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(), //nos tiene que enviar con ese parametro nombre
    validarCampos  
] ,crearCategoria)

// Actualizar categoria - token valido
router.put('/:id',[
    validarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId),
    validarCampos

] , actualizarCategoria )

// Borrar categoria con - solo si es admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongovalido').isMongoId(),
    check('id').custom( existeCategoriaPorId),
    validarCampos

],borrarCategoria)




module.exports = router;