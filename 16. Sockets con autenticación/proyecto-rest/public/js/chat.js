
var url = 'http://localhost:5000/api/auth/'

let usuario = null;
let socket = null;

// Referencias HTML

const textUid = document.querySelector('#textUid')
const txtMensaje = document.querySelector('#txtMensaje')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir = document.querySelector('#btnSalir')



// validar el token de localstorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if(token.length  <= 10){
        window.location = 'index.html'
        throw new Error('No hay token en el  servidor ')
    }

    const resp = await fetch(url, {
        headers: {'x-token' : token }
    });

    const {usuario: userDB , token: tokenDB} = await resp.json()
    // console.log(userDB , tokenDB)
    localStorage.setItem('token', tokenDB)
    usuario = userDB
    document.title = usuario.nombre

    await connectarSocket()
}


// establecer la conexion con nuestro backend
const connectarSocket = async() => {
    // TODO enviamos informacion - a sockets - controller
    socket = io({
        'extraHeaders':{
            // que yo se que esta validado el token
            'x-token' : localStorage.getItem('token')

        }
    }); // esta es la parte para la conectarme con nuestro backend server

    socket.on('connect' , () => {
        console.log('Sockets online')
    })
    socket.on('disconnect' , () => {
        console.log('Sockets offline')
        

    })

    
    socket.on('recibir-mensajes',dibujarMensajes);
    socket.on('usuarios-activos', dibujarUsuarios );

    socket.on('mensaje-privado', ( payload ) => {
        console.log('Privado:', payload ) //solo a la persona a la que quiero enviarle caera el mensaje
    });

}

const dibujarMensajes = ( mensajes = []) => {

    let mensajesHTML = '';
    mensajes.forEach( ({ nombre, mensaje }) => {

        mensajesHTML += `
            <li>
                <p>
                    <span class="text-primary">${ nombre }: </span>
                    <span>${ mensaje }</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHTML;

}



const dibujarUsuarios = ( usuarios = []) => {
    console.log(usuarios)
    let usersHtml = '';
    usuarios.forEach( ({ nombre, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${ nombre } </h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;

}


btnSalir.addEventListener('click', ()=> {

    localStorage.removeItem('token');

    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then( () => {
        console.log('User signed out.');
        window.location = 'index.html';
    });
});

txtMensaje.addEventListener( 'keyup', (ev) => { //escribir en consola cada caracter
    // Nos encargaremos de leer el keyCode que es una de las consola
    const {keyCode} = ev

    const mensaje = txtMensaje.value
    const uid = textUid.value

    if(keyCode !== 13){return;} //enter enviaremos el mensaje
    if(mensaje.length === 0){return;}
    
    //Nunca enviar un string directamente , siempre un objeto
    socket.emit('enviar-mensaje', {mensaje, uid})

    txtMensaje.value = '';

    
    
})




const main = async() => {

    //validar JWT
    await validarJWT();
}




main();

