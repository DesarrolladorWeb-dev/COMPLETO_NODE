const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares"); //podemos solo tener la carpeta middelware
const { crearProducto,
        obtenerProductos,
        obtenerProducto, 
        actualizarProducto,
        borrarProducto } = require("../controllers/productos");
const { existeProductoPorId, existeCategoriaPorId } = require("../helpers/db-validators");


const router = Router();

// {{url}}/api/categorias


// Obtener todas las categorias - publico
router.get('/',obtenerProductos)
// Obtener una las categorias - publico
router.get('/:id',[
    check('id', 'No es un id de Mongovalido').isMongoId(),
    check('id').custom( existeProductoPorId), //para comprobar ejecutamos la funcion
    validarCampos,
]
, obtenerProductos)
// Crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(), //obligatorio por la base de datos
    check('categoria','no es un id de mongo valido').isMongoId(),
    check('categoria').custom( existeCategoriaPorId),
    validarCampos  
] ,crearProducto)

// Actualizar categoria - token valido
router.put('/:id',[
    validarJWT,
    // check('categoria','no es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId),
    validarCampos

] , actualizarProducto )

// Borrar categoria con - solo si es admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongovalido').isMongoId(),
    check('id').custom( existeProductoPorId),
    validarCampos

],borrarProducto)

// 5:00


module.exports = router;