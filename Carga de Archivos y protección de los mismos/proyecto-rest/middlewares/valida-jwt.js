const {response, request} = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')
const usuario = require('../models/usuario')
const validarJWT = async(req = request ,res = response, next) => {
    // tomar de los headers
    const token = req.header('x-token') 
    if(!token){
        return res.status(401).json({
            msg:'No  hay token en la peticion'
        })
    }
    
    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY) //nos sirve para verificar nuestro web token

        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid); 
        // Verifica si el usuario es udefined porque no lo encuentra porque lo borra de la BD
        if (!usuario){
            return res.status(401).json({
                msg:'Token no valido - usuario no existe DB'
            })
        }



        // Verificar si el uid tiene estado true
        if (!usuario.estado){
            return res.status(401).json({
                msg:'Token no valido - usuario con estado : false'
            })
        }


        //console.log(payload) //informacion del token como fecha de expiracion
        // TODO lo usaremos en el controller
        req.usuario = usuario
        
        


        next()
        
    } catch (error) { //muchos errores pueden ocurrir como token manipulado , expirado , el secret no sea el mismo  
        console.log(error)
        res.status(401).json({
            msg : 'Token no valido'
        })
    }
}
module.exports = {
    validarJWT
}