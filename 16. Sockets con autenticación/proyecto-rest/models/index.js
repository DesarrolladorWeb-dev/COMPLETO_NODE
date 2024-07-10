const Categoria = require('./categoria')
const Producto = require('./producto')
const Role = require('./role') //asegurarse que esta escrito asi en el modelo Role
const Server = require('./server')
const Usuario = require('./usuario')
const ChatMensajes = require('./chat-mensajes')



module.exports = {
    Categoria,
    ChatMensajes,
    Producto,    
    Role,
    Server,
    Usuario,
}