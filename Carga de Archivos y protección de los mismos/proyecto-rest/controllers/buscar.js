const {response} = require('express')
const {ObjectId} = require('mongoose').Types;
const {Usuario , Categoria, Producto} =require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino); //TRUE
    if(esMongoId) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            results : (usuario) ? [usuario] : []  // tiene un token valido  pero no encuentra el usuario le enviara un []
        })
    }
    // expresion regular para que sea insensible con las mayusculas y minusculas
    const regex = new RegExp( termino , 'i');
    // ahora no importa si por url se envia el usuario en Mayus o Minus se mostrara todos que tengan test en su nombre
    // y si pones 15 solo tendras el usuario con 15
    //si escribes 1 te mostrara todos los que tiene 1


    // usar count para saber cuando usuario hay
    const usuarios = await Usuario.find({
        // el $or tiene que cumplir la primera condicio o  la otra condicion siguiente
        $or: [{nombre : regex} , {correo : regex}],
        $and : [{estado : true}]
    })
    res.json({
        results : usuarios
    })
}

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino); //TRUE
    if(esMongoId) {
        const categoria = await Categoria.findById(termino)
        return res.json({
            results : (categoria) ? [categoria] : []  
        })
    }
    // es como usar un Like
    const regex = new RegExp( termino , 'i');

    const categorias = await Categoria.find({nombre : regex , estado : true})
    res.json({
        results : categorias
    })
}

const buscarProductos = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino); //TRUE
    if(esMongoId) {
        // usamos populate para entrar al objeto categoria y dentro de este producto y usar sus propiedades
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
        return res.json({
            results : (producto) ? [producto] : []  
        })
    }
    // es como usar un Like
    const regex = new RegExp( termino , 'i');

    const productos = await Producto.find({nombre : regex , estado : true})
                            .populate('categoria', 'nombre')
    res.json({
        results : productos
    })
}





const buscar = (req , res = response) => {

    const {coleccion , termino } = req.params;
    

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg : `las colecciones permitidas son : ${coleccionesPermitidas}`
        })
    } 

    switch (coleccion) {
        case 'usuarios' : 
            buscarUsuarios(termino, res)
        break;
        case 'categorias' : 
            buscarCategorias(termino , res)
        break;
        case 'productos' : 
            buscarProductos(termino, res)
        break;

        default:
            res.status(500).json({
                msg:'Se le olvido hacer esta busqueda'
            })



    }

}

module.exports = {
    buscar
}