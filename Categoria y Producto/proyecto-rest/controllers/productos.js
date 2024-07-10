const {response} = require('express')
const {Producto} = require('../models') 

const obtenerProductos = async (req, res = response) => {
    const query = {estado : true}
    const {limite = 5, desde = 0} = req.query  //en el url puedes enviar uno de los dos

    const [total, productos] = await Promise.all([
      Producto.countDocuments(query),
      Producto.find(query)
    //   Mostrar el usuario que lo creo
      .populate('usuario', 'nombre')
      .populate('categoria', 'nombre') 
      .skip(Number(desde))
      .limit(Number(limite))
    ])
    res.json({
      total,
      productos
    });


}

// obtenerCategoria - populate{}
const obtenerProducto = async(req, res  = response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre')
    res.json(producto);
}

// borrarCategoria - pasar el estado: false



const crearProducto = async (req, res = response) => {
    const {estado, usuario , ...body} = req.body  //es estado y usuario ingnorarlos 
    
    const productoDB = await Producto.findOne({ nombre : req.body.nombre}) //solo comparara por nombre entonces solo se envia el nombre
    if(productoDB){
        return res.status(400).json({
            msg : `la producto ${productoDB.nombre} ya existe`

        })
    }

    
    const data = {
        ...body,
        nombre : body.nombre.toUpperCase(),
        usuario  : req.usuario._id 
    }

    console.log(data)
    const producto = new Producto(data)

    // Guardar en DB
    await producto.save();
    // Mandamos el status 201 para creado uno
    res.status(201).json(producto)

}

// actualizarCategoria
const actualizarProducto = async ( req, res = response) => {
    const {id} = req.params;
    const {estado , usuario , ...data} = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();

    }

    data.usuario = req.usuario._id; //el usuario que lo esta actualizando

    const producto = await Producto.findByIdAndUpdate(id,data,{new : true})

    res.json(producto)


}

const borrarProducto = async(req, res = response) => {
    const {id} = req.params;
    const productoBorrado = await Producto.findByIdAndUpdate(id, {estado : false} , {new:true});
    res.json(productoBorrado)
}



module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}


// hora 13