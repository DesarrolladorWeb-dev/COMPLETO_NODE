// los controladores no son mas que funciones
const {response}  = require('express')
const Usuario = require('../models/usuario')
const bcryptjs= require('bcryptjs')
const { generarJWT } = require('../helpers/generar-jwt')

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

module.exports = {
    login
}