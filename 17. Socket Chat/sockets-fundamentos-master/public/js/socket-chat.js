var socket = io();

// para leer el parametro por la url : http://localhost:3000/chat.html?nombre=Fernando
var params = new URLSearchParams(window.location.search);

if(!params.has('nombre') || !params.has('sala')){  
    window.location = 'index.html' //si no esta en la url lo redirecciona
    throw new Error('El nombre y la sala son necesarios ')
}

var usuario = { 
    // obtenemos el nombre de la url
    nombre  : params.get('nombre'),
    sala: params.get('sala')
} 


socket.on('connect', function() {
    console.log('Conectado al servidor');

    // para decirle a mi backend quien soy yo 
    // si me hacepta la conexion ejecutamos un callback 
    socket.emit('entrarChat', usuario , function(res){
        // console.log('Usuario conectados ', res) //veremos los conecatados del usuarios.js en el retorno del callbakc
        renderizarUsuarios(res)

    } )
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
// socket.emit('crearMensaje', {
//     nombre: 'Fernando',
//     mensaje: 'Hola Mundo'
// }, function(resp) {
//     console.log('respuesta server: ', resp);
// });

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    /// CUANDO NO SOY
    renderizarMensajes(mensaje,false); //para que se muestre en los amigos
    scrollBottom() //cada vez que renderize mensaje



});

// Escuchar cambios de usuario 
// cuando un usuario entra o sale del char - seran notificados todos menos el que se conecta o desconecta usando el broadcast
socket.on('listaPersona', function(personas) {
    renderizarUsuarios(personas)
    // console.log( personas);

});
// Mensajes privados
socket.on('mensajePrivado',function(mensaje){
    console.log('mensajeprivado: ' , mensaje)
})