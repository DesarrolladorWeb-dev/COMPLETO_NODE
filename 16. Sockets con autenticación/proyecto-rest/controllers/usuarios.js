const {response , request} = require('express')
const bcryptsjs = require('bcryptjs')

const Usuario = require('../models/usuario') // la u mayuscula por estandar

const usuariosGet = async(req = request , res = response) => {
    const query = {estado : true}
    
    const {limite = 5, desde = 0} = req.query  //en el url puedes enviar uno de los dos

    
    const [total, usuarios] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
    ])
    res.json({
      total,
      usuarios
    });
  }

  const usuariosPost = async (req, res = response) => {
    const {nombre , correo , password, rol} = req.body
    // son todos los campos que quiero grabar en la creacion del usuario
    const usuario = new Usuario({nombre , correo , password , rol}) // esto es simplemente la creacion de la instancia
    // encriptar la contraseña
    const salt = bcryptsjs.genSaltSync() //la cantidad de encriptacion el 10 es por defecto
    usuario.password = bcryptsjs.hashSync(password,salt)  // se guarda como contraseña
    // Guardar en la bd

    await usuario.save() // para guardar el registro
    res.json({
      
      usuario
    });
  }

  const usuariosPut = async (req, res = response) => {
    
    const {id} = req.params;
    const {_id , password, google, correo, ...resto} = req.body;  //es el parametro enviado por el router si hay mas parametros se puede desustructurar

    //TODO validar contra base de datos
    //*NOTA no se podra actualizar google y correo
    if (password) { //si existe password
      const salt = bcryptsjs.genSaltSync() 
      resto.password = bcryptsjs.hashSync(password,salt)  //aqui le establecemos  el password nuevo
    }
    
    const usuario = await Usuario.findByIdAndUpdate( id , resto);

    res.json(usuario); //le podremos enviar solo el objeto
  }

  const usuariosDelete = async (req, res = response) => {
    const {id} = req.params
 
    // const uid = req.uid  // lo usamos aqui desde el midelware

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id)
    
    // cambiaremos el estado a false
    const usuario = await Usuario.findByIdAndUpdate(id , {estado : false})
    // const usuarioAutenticado = req.usuario; //aparecera el usuario que estoy borrando y el usuario autenticado

    res.json(usuario); 
  }

  const usuariosPatch = (req, res = response) => {
    
    
    res.json({
      ok: true,
      msg: "patch API Controlador",
    });
  }


// exporto el objeto
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch,
}