const {Socket} = require('socket.io')
const { comprobarJWT } = require('../helpers')
const {ChatMensajes} = require('../models');


const chatMensajes = new ChatMensajes();


const socketController = async (socket = new Socket(), io) => {
//! el io tiene el control absoluto y puede enviar el mensaje a cualquiera que este ahi 

// TODO  NOTA AQUI EN TODO MOMENTO TENGO CUAL ES EL USUARIO CONECTADO
    
    const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
    
    if(!usuario){
        return socket.disconnect()
    }
    


    // Agregar el usuario conectado
    chatMensajes.conectarUsuario( usuario );
    io.emit('usuarios-activos',   chatMensajes.usuariosArr );
    // TODO Conecta el nuevo usuario - Solo quiere los  ultimos 10 mensajes 
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)
    
    // TODO mensajes privados 
    //como ya sabemos el id de cada cliente que aparece debajo de sus nombres
    // Conectarlo a una sala especial
    // * cada uno va a tener tres salas : global, socket.id, usuario.id
    socket.join( usuario.id); // * el socket se conecta a esa sala



    // socket.to(socket.id destino).emit // el cliente recarga el navegador crea un nuevo id
    // socket.to(socket.id) // es volatil


    // Limpiar cuando alguien se desconecta
    socket.on( 'disconnect',()=>{
        // Con esto ya lo eliminamos de la lista cuando se deconecta
        chatMensajes.desconectarUsuario(usuario.id) 
        // Ahora mandamos a emiti a todo el mundo
        io.emit('usuarios-activos', chatMensajes.usuariosArr );

    })

    // a quien se lo quiero enviar el mensaje
    socket.on('enviar-mensaje', ({uid , mensaje}) => {

        if(uid){ //si escribio el uid
            // Mensaje privado, Recordar el servidor es intermediario
            // para quien es el mensaje , y que le voy a emitir 
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre , mensaje })


        }else{
         // *RECORDAR QUE EN TODO MOMENTO TENEMOS EL USUARIO CONECTADO
         chatMensajes.enviarMensaje(usuario.id , usuario.nombre , mensaje)

         //  lo envia a todos y ami
         // cuando se preciona enter en para imprimir el mensaje en consola 
         //solo seran dies objetos los que se mostraran en consola 
         //solo 10 mensajes tuyos o el que lo envia
          io.emit('recibir-mensajes', chatMensajes.ultimos10)
        }


       
    })
}
module.exports = {
    socketController
}