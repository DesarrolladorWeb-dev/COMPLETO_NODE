const jwt = require('jsonwebtoken');
 
const axios = require('axios');

// --------

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



const googleVerify = async (Token = '') => {
  try {
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${Token}`);
    const tokenInfo = response.data;
    console.log(tokenInfo)
    return tokenInfo;   

    
  } catch (error) {
    // Si ocurre algún error durante la verificación, se considera que el token es inválido
    return false;
  }
}



module.exports = {
    generarJWT,
    googleVerify
    
}

