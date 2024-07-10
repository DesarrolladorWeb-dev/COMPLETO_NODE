const jwt = require('jsonwebtoken');
 
const generarJWT = (uid = '') => { //uid identificador unico
    return new Promise((resolve , reject) => {
        const payload = {uid};
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{
            expiresIn: '4h' //opciones
        },(err,token) => {
            if (err) {
                console.log(err)
                reject('No se pudo generar el token')
            }else{
                resolve(token)
            }
        } )
    })
}
module.exports = {
    generarJWT,
}