const Role = require('../models/role');
const {Usuario , Categoria, Producto} = require('../models'); //estructurarlo


// creacion de validaciones personalizadas

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}
const   existeUsuarioPorId = async(  id) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

// Categorias

const   existeCategoriaPorId = async(  id) => {
    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

// Categorias

const   existeProductoPorId = async(  id) => {
    // Verificar si el correo existe
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

// Validar colecciones permitidas

const coleccionesPermitidas = (coleccion = '' , colecciones = []) => {
    const incluida = coleccion.includes(coleccion)
    if(!incluida) {
        // llegara solo hasta aqui 
        throw new Error(`La coleccion ${coleccion} no es permitida , ${colecciones}`)
    }
    // se tiene que usar return true en todas
    return true
}

module.exports = {   //Recomendado enviarlo como objeto siempre
    emailExiste,
    esRoleValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}