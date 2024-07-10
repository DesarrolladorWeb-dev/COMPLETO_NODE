const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = (files ,   extensionesValidas = ['png','jpg','jpeg','gif'], carpeta = '' ) => { //tendre la request desde files , incluso puedo desestructurar el archivo
    // extension validar pasa como parametro pero van a tener valor por defecto
    
    return new Promise ( (resolve, reject) => {
        const {archivo} = files; //no necesito req. solo files
        const nombreCortado = archivo.name.split('.') //para separar mi string por el punto y devuelve una lista
        const extension = nombreCortado[nombreCortado.length - 1] //la ultima posicion que es la extension
    
        //Validar la extension
        if(!extensionesValidas.includes(extension)){
            // como no existe response usamos reject
            return reject( `La extension ${extension} no es permitida - ${extensionesValidas}`);
        }
    
        // Crear clave Unica - ayuda cuando suben archivo con el mismo nombre
        const nombreTemp = uuidv4() + '.' + extension; // este sera el nombre de mi archivo
    
    
    
        // __dirname comienza desde la carpeta controller
        // name - es el que se encuentra en la consola
        // 'carpeta en la que quiero colocar la imagen'
        const uploadPath = path.join( __dirname, '../uploads/',carpeta , nombreTemp)
    
        // lo quiero mover al path donde lo quiero colocar
    
        archivo.mv(uploadPath, function(err) {
            if (err) {
                reject(err)
            }
    
            resolve(nombreTemp)
        }); 
    })

    
}

module.exports = {
    subirArchivo
}