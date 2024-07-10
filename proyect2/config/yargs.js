const argv = require('yargs')
    .option('b', {
        alias: 'base',
        type:'number',
        demandOption : true
    })
    .option('l', {
        alisa : 'listar',
        type : 'boolean',
        demandOption: true,
        default : false
    })
    .check((argv, options) => {
        if(isNaN(argv.b)){
            throw 'La base tiene que ser un numero'
        }
        return true // si no hay ningun error
    }).argv;

module.exports = argv;