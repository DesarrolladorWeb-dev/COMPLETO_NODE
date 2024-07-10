const dbValidators  = require('./db-validators')
const generarJWT    = require('./generar-jwt')
const googleVerify  = require('./google-verify')
const subirArchivo  = require('./subir-archivo')


// exportamos esparciendo todo su contenido 
// de esta manera tendre todas sus propiedades por ejeplo si tiene 
// TODO funciones , contancia , o variable
// entonces lo tendre todo en el module exports
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}