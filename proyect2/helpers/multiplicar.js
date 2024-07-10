

const { resolve } = require('path');
const colors = require('colors')



const crearArchivo = async (base=4 , listar = false) => {
        const fs = require('fs');
        console.log(`Tabla del : ${base}`)  
        try {
            let salida = '';
            for (let i = 1; i <= 10 ; i++) {
                salida += `${base} ${'x'.green} ${i} = ${ base * i} \n`
            }
            if (listar) {
                console.log('=============='.green);
                console.log(' Tabla del :' , colors.blue(base))
                console.log('=============='.green);

                console.log(salida)
            }
        fs.writeFileSync(`tabla-${base}.txt` , salida)
        return `tabla${base}.txt`
            
        } catch(error) {
            console.log(error)
        }
        

}
module.exports = {
    crearArchivo 
}

