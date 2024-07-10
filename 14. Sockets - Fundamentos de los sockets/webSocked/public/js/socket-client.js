// Referencia del HTML

const lblOnline = document.querySelector('#lblOnline')
const lblOffline = document.querySelector('#lblOffline')
const txtMensaje = document.querySelector('#txtMensaje')
const btnEnviar = document.querySelector('#btnEnviar')



//cliente cuando se conecta
const socket = io() //ya esta importado en el index.html

// es como eventlistener
socket.on('connect',() => {
    // console.log('Conectado')
    lblOffline.style.display = 'none'
    lblOnline.style.display = ''
})
socket.on('disconnect',() => {
    // console.log('Desconectado del servidor')
    lblOnline.style.display = 'none'
    lblOffline.style.display = ''
})

// esto depende del controller , por ejemplo aqui el broadcast
socket.on('enviar-mensaje',(payload) => { 
    console.log(payload)
})                            


btnEnviar.addEventListener('click' , () => {
    const mensaje = txtMensaje.value;
    const payload = {
        mensaje,
        id: '123ABC',
        fecha: new Date().getTime()
    }
    // enviamos el mensaje al servidor
    // socket.emit('enviar-mensaje' ,  payload) //nota que no sea camel case el nombre
                                     //el id sera el callback lo que sea que envia el backend
    socket.emit('enviar-mensaje', payload , (id) => {

        // es el mensaje cuando todo se envio correctamente
        console.log('Desde el server' , id)
        
    
        // a todos se le mostrara ese mensaje porque todos estan sincronizados
        // console.log(payload)
    })
    
})