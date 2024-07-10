const { io } = require('../server');
const {Usuarios} = require('../classes/usuarios')
const { crearMensaje} = require('../utilidades/utilidades')


const usuarios = new Usuarios(); //no require argumentos solo inicializa el arreglo 

io.on('connection', (client) => {

    client.on('entrarChat' , (data, callback) => {
        if(!data.nombre || !data.sala){
            return callback({
                error: true , 
                mensaje : 'El nombre/sala es necesario'
            });
        }
        // conectar al usuario en una sala 
        client.join(data.sala);


        // usasmos el objeto de la conexion client para el id 
        // esto nos dara todos los usuario conectados en el arreglo
        let personas = usuarios.agregarPersona(client.id , data.nombre , data.sala) ;

        //cada persona que entra al chat o sale se ejecuta - envia a listarPersona esta informacion de getPersonas
        // data.sala es para que solo se emita a los que estan en la sala
        client.broadcast.to(data.sala).emit('listaPersona',usuarios.getPersonasPorSala(data.sala)) 

        // Nos ayudara a mostrar a la otra persona que se unio
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unio`))

        callback (usuarios.getPersonasPorSala(data.sala)); //retornar las personas conectadas en la sala
    })

    client.on('crearMensaje',(data, callback) => {
        // tendremos la persona actualmente conectada 
        let persona = usuarios.getPersona(client.id ) 

        // la informacion kque el cliente me tiene que enviar 
        let mensaje = crearMensaje(persona.nombre, data.mensaje)  
        // emitimos a todo el mundo - pero to(persona.sala ) : solo a la sala
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje)
     

        callback(mensaje) //regresamos el mensaje
    });
    
    client.on('disconnect', () => {
        // Cuando recarga se deconecta y borrara el usuario
        let personaBorrada =  usuarios.borrarPersona(client.id) ; 
        // envia el mensaje a todos menos al que perdio la conexion
        // enviamos solo a los de la sala
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio`))
        // emitimos a las personas por sala
        client.broadcast.to(personaBorrada.sala).emit('listaPersona',usuarios.getPersonasPorSala(personaBorrada.sala)) 
    });

    // Mensajes Privados 
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id)
        // primero es el nombre y luego el mensaje 
        // to(data.para) : con el id de la otra persona le enviamos el mensaje a una persona en especifico
        // para :  es el campo adicional donde enviaremos el id 
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje))
    });
});