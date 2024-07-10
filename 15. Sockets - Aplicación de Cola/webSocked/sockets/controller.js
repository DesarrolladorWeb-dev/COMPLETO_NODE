const TicketControl = require('../models/ticken-control')
const ticketControl = new TicketControl() //aqui se ejecutara el contructor



const socketController = (socket) => {


  // Todos estos eventos se ejecutan cuando un nuevo cliente se conecta
  socket.emit('ultimo-ticket' , ticketControl.ultimo)
  socket.emit('estado-actual' , ticketControl.ultimo4)
  // Ticketst pemdientes - para que se muestre en todos los Escritorios el total
  socket.emit('tickets-pendientes', ticketControl.tickets.length)




  // en el callback mostrare el tiket que debe ir en la pagina web de tikets 

    socket.on("siguiente-ticket", (payload, callback) => {
        
      const siguiente = ticketControl.siguiente()
      // crea un guarda el objeto en el array tickets - y actualiza la bd
      callback (siguiente)

      // PANTALLA MORADA Aqui solo una ves porque al cliente no le interesa los pendientes que hay 
      socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length) //para actualizar a todos
        
    });
socket.on('atender-ticket', ({escritorio}, callback) => {
  // obtendremos el objeto escritorio al presionar el boton azul - del payload
  
  if(!escritorio){
    // EL callback es como return aqui
    return callback({
      ok: false,
      msg: 'El escritorio es obligatorio'
    })
  }
// recibe el escritorio al cual le quiero asignar el ticket
  const ticket = ticketControl.atenderTicket(escritorio)

// Volver a disparar los eventos a todos cuando se adigne un nuevo ticket

  // TODO Notificar cambio en los ultimos4 a la pantalla de publico.html- para que se actualize cuando se agrege en escritorio
  socket.broadcast.emit('estado-actual' , ticketControl.ultimo4)
  socket.emit('tickets-pendientes',ticketControl.tickets.length) //para que me actualize 
  socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length) //para actualizar a todos


  if (!ticket) {
    callback({
      ok: false,
      msg : 'Ya no hay tickets pendientes'
    })
  }else {
    callback({
      ok:true,
      ticket
    })
  }

})  


};

module.exports = {
  socketController,
};
