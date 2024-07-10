const {response} = require('express')
const { Categoria} = require('../models') // para tener todas las funciones de models

// ObtenerCategorias - paginado - total - usar el metodo populate
// populate cuando imprimimosolo tendremos el id para indicar quien fue que lo creo
const obtenerCategorias = async (req, res = response) => {
    const query = {estado : true}
    const {limite = 5, desde = 0} = req.query  //en el url puedes enviar uno de los dos

    const [total, categorias] = await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query)
    //   Mostrar el usuario que lo creo
      .populate('usuario', 'nombre') //referencia "usuario"  y solo quiero el nombre del usuario
      .skip(Number(desde))
      .limit(Number(limite))
    ])
    res.json({
      total,
      categorias
    });


}

// obtenerCategoria - populate{}
const obtenerCategoria = async(req, res  = response) => {
    const {id} = req.params;
    const categorias = await Categoria.findById(id).populate('usuario', 'nombre')
    res.json(categorias);
}

// borrarCategoria - pasar el estado: false



const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase(); //las ccategorias lo almacenare en mayus
    
    const categoriaDB = await Categoria.findOne({ nombre})
    if(categoriaDB){
        return res.status(400).json({
            msg : `la categoria ${categoriaDB.nombre} ya existe`

        })
    }

        // TODO usuario : req.usuario._id  esto es el correcto en el video
        // Categoria  : req.Categoria._id //es la info que nos envia el node  

    // Generar la data a guardar //el frontend no debe enviar el estado
    const data = {
        nombre,
        usuario : req.usuario._id  //esto es el correcto en el video

    }

    console.log(data)
    const categoria = new Categoria(data)

    // Guardar en DB
    await categoria.save();
    // Mandamos el status 201 para creado uno
    res.status(201).json(categoria)

}

// actualizarCategoria
const actualizarCategoria = async ( req, res = response) => {
    const {id} = req.params;
    const {estado , usuario , ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    // data.usuario = req.usuario._id; //id del usuario sueño del token
    

    const categoria = await Categoria.findByIdAndUpdate(id,data,{new : true})

    res.json(categoria)


}

const borrarCategoria = async(req, res = response) => {
    const {id} = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado : false} , {new:true});
    res.json(categoriaBorrada)
}



module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}