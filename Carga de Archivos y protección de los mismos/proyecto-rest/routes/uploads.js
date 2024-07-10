const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos , validarArchivoSubir} = require("../middlewares");
const {cargarArchivo, actualizarImagen, mostrarImagen,actualizarImagenCloudinary} = require('../controllers/uploads');
const { coleccionesPermitidas } = require("../helpers");

const router = Router();

router.post ('/' , validarArchivoSubir ,cargarArchivo)

router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id' , 'El id debe ser de mongo').isMongoId(),
    // tendremos la coleccion - mandamos la coleccion en el put , y las colecciones permitidas
    // TODO lo que aqui se realiza es que la coleccion sea permitida 
    check('coleccion').custom(c => coleccionesPermitidas(c , ['usuarios', 'productos'] )),
    // el check no bloquea hasta validar campos
    validarCampos

],actualizarImagenCloudinary)
// ],actualizarImagen)


router.get('/:coleccion/:id',[
    check('id' , 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c , ['usuarios', 'productos'] )),
    validarCampos
], mostrarImagen ) 

module.exports = router;