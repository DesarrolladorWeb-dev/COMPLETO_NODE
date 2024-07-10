// claudinary 
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);


// Propios de node
const path = require('path')
const fs = require('fs') 


const {response} = require('express');
const {subirArchivo} = require('../helpers')
const {Usuario , Producto} = require('../models')


// ayuda poner el response por el tipado
const cargarArchivo = async(req, res = response) => {


    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({ msg : ' No hay archivos que subir'});
        return;
    }
    // TODO de esta manera solucionamoe el error de el uso de reject()
    try {
        
    // el path por defecto sera la carpeta upoads , enviamos los archivo que queremos subir
    // creamos la carpeta con ayuda de expressfileupload : createParentPath - solucionamos el error por defecto esta en false - archivo server.js
    const nombre = await  subirArchivo(req.files, undefined, 'imgs'); // usar undefined si quieres el valor por defecto
    res.json({nombre})
    
    } catch (msg) {
        res.status(400).json({msg})
    }
}

const actualizarImagen = async (req , res = response) => {


    const {id , coleccion} = req.params;
    let modelo; // para establecer de manera condicional

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            // validamos los usuarios
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
                
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return  res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
                
            }
        break;
    
        default:
            return res.status(500).json({msg : 'Se me olvido validar esto'})
    }
    
    // TODO Limpiar Imagenes Previas - PARA TENER LA ULTIMA IMAGEN SUBIDA 

    if(modelo.img){ //vemos que el img en mongo tiene contenido
    //Contruimos el path para borrarlo , el nombre completo = modelo.img
    const pathImagen = path.join(__dirname,'../uploads', coleccion,modelo.img)
    if(fs.existsSync(pathImagen)){ // si existe la voy  a borrar
        fs.unlinkSync(pathImagen)
    }
}


    // Subimos el archivo, coleccion - nombre de carpeta (productos , usuarios)
    const nombre = await subirArchivo(req.files, undefined, coleccion); 
    modelo.img = nombre; //sera igual al nombre del archivo

    await modelo.save() //se salva en base de datos


    res.json(modelo)
    
}

const actualizarImagenCloudinary = async (req , res = response) => {


    const {id , coleccion} = req.params;
    let modelo; // para establecer de manera condicional

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
            // validamos los usuarios
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
                
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return  res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
                
            }
        break;
    
        default:
            return res.status(500).json({msg : 'Se me olvido validar esto'})
    }
    
    // TODO Limpiar Imagenes Previas - PARA TENER LA ULTIMA IMAGEN SUBIDA 

    if(modelo.img){ //vemos que el img en mongo tiene contenido
      //para que solo tengamos el nombre de todo el url
      const nombreArr = modelo.img.split('/');
      const nombre = nombreArr[nombreArr.length - 1 ];
      const [public_id] = nombre.split('.');
      // console.log(public_id) //el id sera del anterior imagen
      cloudinary.uploader.destroy(public_id) //para borrar la imagen anterior

    }

    // console.log(req.files.archivo)
    
    // Le pasaremos el Path Temporal
    const {tempFilePath} = req.files.archivo
    // secure_url : la url de la imagen publica online
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)

    modelo.img = secure_url; //sera igual al nombre del archivo

    await modelo.save() //se salva en base de datos


    res.json(modelo)
    
}

const mostrarImagen = async (req , res = response ) => {

    const {id , coleccion} = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id)
           
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                })
                
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id)
            if (!modelo) {
                return  res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                })
                
            }
        break;
    
        default:
            return res.status(500).json({msg : 'Se me olvido validar esto'})
    }
    

    if(modelo.img){ 
    
        const pathImagen = path.join(__dirname,'../uploads', coleccion,modelo.img)
        // si la imagen se encuentra
        if(fs.existsSync(pathImagen)){ 
            return res.sendFile(pathImagen) //responderemos enviando el pad de la imagen
        }

    }
    // Si el producto no tiene una imagen
    // por el scope las contantes se pueden volver a repetirse
    const pathImagen = path.join(__dirname,'../assets/no-image.jpg')
    res.sendFile(pathImagen)


}



module.exports= {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}