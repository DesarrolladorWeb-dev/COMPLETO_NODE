const { response } = require("express");

const esAdminRole = (req , res = response , next) => { //response para tener el tipado
    if(!req.usuario){ //si no obtiene el objeto creado por el midelware valida-jwt
        return res.status(500).json({
            msg : "Se quiere verificar el role sin validar el token primero"
        })
    }
    const {rol, nombre } = req.usuario;  
    // Verifica si el usuario no es administrador entonces hace el return y no pasa por next()
    if(rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg : `${nombre} no es administrador - No puede hacer esto`
        })
    }

    next()
}

const tieneRole = (...role) => { //no podemos poner role1 ,role2 role3 ...  , el spreed operator lo cambia a arreglo

    
    // es para retornar un valor que se piden en la consola
    return (req, res = response , next) => {
        //console.log(role, req.usuario.rol) //el rol del objeto 


        //TODO lanzara el error en caso de querer ejecutar el midelware sin haber valido el json web token primero
        if(!req.usuario){ 
            return res.status(500).json({
                msg : "Se quiere verificar el role sin validar el token primero"
            })
        }
        if (!role.includes(req.usuario.rol)) { // si no esta incluido en el usuario json
            return res.status(401).json({ // entro poque el  usuario tiene uno de los roles de esa lista
                msg : `El servicio requiere uno de estos roles ${role}`
            })
        }
        next();

        }
}

module.exports = {
    esAdminRole,
    tieneRole,
}