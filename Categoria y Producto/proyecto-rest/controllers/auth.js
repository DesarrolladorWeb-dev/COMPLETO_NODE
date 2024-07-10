// los controladores no son mas que funciones
const {response}  = require('express')
const Usuario = require('../models/usuario')
const bcryptjs= require('bcryptjs')
const { generarJWT , googleVerify } = require('../helpers/generar-jwt')
const { validationResult } = require('express-validator')

// ------------------



const login = async (req, res = response ) => {

    const {correo, password} = req.body
    try {
        // verificar si el email existe
        const usuario =  await Usuario.findOne({correo})
        if(!usuario){
            return res.status(400).json({
                msg:'Usuario / password no son correctos - correo '
        })
        }

        //Si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg:'Usuario / password no son correctos - estados: false '
        })
        }
        //Verifica la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password); //compara el password y el password del usuario existente
        if (validPassword) {
            return res.status(400).json({
                msg:'Usuario / password no son correctos - password '
        })
        }
        // Genera el Jwt
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'

        })
    }
}

const googleSignin = async (req , res = response) => {
    
    const {token , correo , img , nombre} = req.body;
    
    const validarToken = await  googleVerify(token)
    


    // console.log("mensaje" + JSON.stringify(validarToken));  // importante pasar a json
    try {
        let  usuario = await Usuario.findOne({correo})
        if(!usuario) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password : ':P',
                img,
                google : true
            }
            usuario = new Usuario(data);
            await usuario.save()
        }

        // Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Hable con el administrador usuario bloqueado'
            })
            
        }
        // Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es valido'
        })
    }

    
}



module.exports = {
    login,
    googleSignin
}