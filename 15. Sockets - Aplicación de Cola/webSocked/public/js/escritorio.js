
//Referencia HTML
const lblEscritorio = document.querySelector('h1') //el primer h1 que encuentre
const btnAtender = document.querySelector('button')
const lblTicket = document.querySelector('small')
const divAlerta = document.querySelector('.alert')
const lblPendientes = document.querySelector('#lblPendientes')



// Obtenemos la url
const searchParams = new URLSearchParams(window.location.search)



// saber si existe el escritorio o no 
if(!searchParams.has('escritorio')){
    window.location = 'index.html' //me envia a el index principal
    throw new Error('El escritorio es obligatorio')
}

const escritorio = searchParams.get('escritorio')
lblEscritorio.innerText = escritorio;

// ocultamos la alerta
divAlerta.style.display = 'none'


const socket = io();

// si mi coneccion no este conectado no podre realizar click

socket.on('connect', () => {
    btnAtender.disabled = false

});

socket.on('disconnect', () => {
    btnAtender.disabled = true
});


// para que al recargar estara en la escucha para ejecutarse y mostrar el ultimo ticket
socket.on('tickets-pendientes', (pendientes) => {
    if (pendientes === 0) {
        lblPendientes.style.display = 'none'
    } else {
        lblPendientes.style.display = ''
        lblPendientes.innerText = pendientes
        
    }
})


btnAtender.addEventListener( 'click', () => {

    // TODO escritorio: enviar , payload : atender 
                                        // se envia el objeto escritoria a payload  y se ejecutara la funcion de escucha en controller
                                        // entonces payload tiene el objeto escritorio en su interior
    socket.emit('atender-ticket' , {escritorio}, (payload) => {
        //usa el return de payload que es el callback de controller
        const {ok , ticket, msg} = payload
        if (!ok) {
                lblTicket.innerText = 'Nadie.'
                return divAlerta.style.display = ''
        }

        lblTicket.innerText = `Ticket` + ticket.numero;


    })

    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket
    // });

});