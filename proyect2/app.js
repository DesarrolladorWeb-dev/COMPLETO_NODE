
// const { argv, options } = require('yargs');
const {crearArchivo} = require('./helpers/multiplicar');
const argv = require('./config/yargs')
require('colors')

                    
console.clear();


console.log(argv)


// const [ , , arg3 = 'base=5'] = process.argv;
// const [ , base = 5] = arg3.split('=')


crearArchivo(argv.b, argv.l) //devuelve una promesa
    .then(nombreArchivo => {
        console.log(nombreArchivo.rainbow, 'creado');
    })
    .catch(err => console.log(err));