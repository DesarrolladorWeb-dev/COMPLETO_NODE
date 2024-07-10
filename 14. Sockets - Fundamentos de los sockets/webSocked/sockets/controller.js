// TODO : el .io se utiliza en casos muy especificos, en peticion press


const socketController = (socket) => {

  // usamos socket.id como identificador
    console.log('cliente conectado', socket.id)


    socket.on("disconnect", () => {
    console.log('Cliente desconectado', socket.id)
    });

  // el cliente que esta conectado , es llamado el payload los valores enviados
    socket.on("enviar-mensaje", (payload, callback) => {
        // es el mensaje cuando todo se envio correctamente , para el que presiono el boton enviar
        const id = 123456; //generado por la base de datos , solo quiero que el cliente 1 sepa del mensaje enviado
        callback( id ); //solo se ejecuta por el canal que se
        
        // emit envia a todos los conectados , pero con socket solo a el que lo envio
        // los socket tambien puede emitir esos mensajes que los io
        // socket.emit('enviar-mensaje', payload)

        // usamos broadcast para enviar a todos menos el que lo envio
        socket.broadcast.emit('enviar-mensaje', payload)

        
    });
};

module.exports = {
  socketController,
};
