const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique : true
    },
    estado: {
        type: Boolean,
        default : true,
        required: true
    },
    usuario: {
        type:Schema.Types.ObjectId, //de tipo objeto id
        ref: 'Usuario', //es mi otro esquema
        require: true 
    }

});

// para no mostrar informacion adicional al json al realizar el get 

CategoriaSchema.methods.toJSON = function() { 
    const { __v, estado, ...data } = this.toObject()
    return data 
}

module.exports = model( 'Categoria', CategoriaSchema );
