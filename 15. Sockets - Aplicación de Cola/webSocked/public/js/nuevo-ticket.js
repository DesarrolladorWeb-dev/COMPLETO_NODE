// Referencias HTML

const lblNuevoTicket = document.querySelector('#lblNuevoTicket')
const btnCrear = document.querySelector('button')



const socket = io();

// si mi coneccion no este conectado no podre realizar click

socket.on('connect', () => {
    btnCrear.disabled = false

});

socket.on('disconnect', () => {
    btnCrear.disabled = true
});


// para que al recargar estara en la escucha para ejecutarse y mostrar el ultimo ticket
socket.on('ultimo-ticket', (ultimo) => {
    lblNuevoTicket.innerText = 'Ticket' + ultimo
})


btnCrear.addEventListener( 'click', () => {
// TODO NODEMON detecta los cambios y  por lo cual se reinicia , en este caso los cambios del json de db 
// TODO crear un archivo de nodemon para ignorar el archivo json 
    socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        // Se mostrara los elementos del del json 
        lblNuevoTicket.innerText = ticket
    });

});