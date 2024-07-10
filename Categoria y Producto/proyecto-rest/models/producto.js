const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique : true
    },
    estado: {  // esto si es como si estuviese eliminado
        type: Boolean,
        default : true,
        required: true
    },
    usuario: {
        type:Schema.Types.ObjectId, //de tipo objeto id
        ref: 'Usuario', //es mi otro esquema
        require: true 
    },
    precio : {
        type: Number,
        default : 0,
    },
    categoria : {
        type:Schema.Types.ObjectId,
        ref: 'Categoria',  // es como un forence key
        require : true
    },
    descripcion : { type : String}, 
    disponible : {type :Boolean , default:true} //puede ser que no tenga existencia, ahora no esta disponible puede ser asi esto

});

// para no mostrar informacion adicional al json al realizar el get 

ProductoSchema.methods.toJSON = function() { 
    const { __v, estado, ...data } = this.toObject()
    return data 
}

module.exports = model( 'Producto', ProductoSchema );