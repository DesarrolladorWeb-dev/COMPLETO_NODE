
const {Schema , model} = require('mongoose');

const UsuarioSchema = Schema({
    
        nombre: {
            type: String,
            required : [true , 'El nombre es obligatorio']
        },
        correo:{
            type  : String,
            required : [true, 'El correo es obligatorio'],
            unique : true 
        },
        password : {
            type : String,
            required : [true , 'La contraseña es obligatoria']
        },
        img:{
            type:String,
        },
        
        rol:{
            type:String,
            required : true,
            default : 'USER_ROLE',
            emun: ['ADMIN_ROLE', 'USER_ROLE'] //validar con alguna numeracion
        },
        estado : {
            type : Boolean,
            default : true // si lo marque como borrado el estado cambiara
        },
        google: {
            type : Boolean,
            default : false
        }
    
})

// TODO forma de hacerlo de manera global
// Crear metodos de UsuarioSchema ya sea para sobreescribir , como el findOne , como validar el correo etc , en este caso sobreescribir el metodo two json y tiene que ser funcion normal
UsuarioSchema.methods.toJSON = function() { //* cuando se mande a llamar toJSON se ejecutara
    // * Lo que quiero quitar de la respuesta JSON 
    const { __v, password, _id, ...usuario } = this.toObject() // esto generara mi instancia con sus valores respectivos : nombre, correo , password img ... como un objeto literal
    usuario.uid = _id //para no cambiar todos los registros en mongo 
    return usuario // solo retornamos el usuario

}

module.exports = model('Usuario', UsuarioSchema)  //le añade la s la base dedatos