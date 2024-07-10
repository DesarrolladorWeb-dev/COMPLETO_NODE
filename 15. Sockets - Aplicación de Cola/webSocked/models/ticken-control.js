const path = require('path')
const fs = require('fs')

class Ticket {
    constructor( numero, escritorio ) {
        this.numero = numero;
        this.escritorio =escritorio;        
    }
    
}




class TicketControl {
    constructor(){
        // primero escribimos todo lo que usaremos , incrementa a medida que lo mande a llamar
        this.ultimo = 0;
        this.hoy =new Date().getDate(); //11 , me ayuda si lo que tengo en la base de datos es el dia de hoy
        this.tickets = []; //manejar los tikets pendientes
        this.ultimo4 = []; //los que se mostrara en la pantalla de los tikets

        this.init()


    }
    // para generara el objeto y retornarlo
    get toJson(){
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimo4: this.ultimo4,

        }
    }

    init(){
        // cuando llame tengo que llamar al archivo json farma rapida 
        const {hoy , tickets , ultimo , ultimo4} = require('../db/data.json') //lo transforma a objeto de js tendra todas las propiedads
        if(hoy === this.hoy){ //lo comparamos con nuestro dia actual
            // enviamos nuestros datos a las propiedades de la clase
            this.tickets = tickets;
            this.ultimo = ultimo;
            this.ultimo4 = ultimo4
        } else {
            //Es otro dia
            this.guardarDB() //no se pone guardar arriba porque los datos ya son iguales

        }

    }
    guardarDB(){
        const dbPath = path.join(__dirname, '../db/data.json')
        //Aqui enviamos con la fecha actual ingresando todo el JSON.stringify(json)
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson) ) //ultimo parametro graba como string , pasamos toJson a stringJson

    }

    // De esta manera sabremos cual fue el nuevo ticket por si se reinicia el backend
    siguiente(){
        this.ultimo += 1;
        // this.ultimo es el nuevo ticket
        const ticket = new Ticket(this.ultimo , null);
        this.tickets.push(ticket)
        this.guardarDB()
        return  'Ticket' + ticket.numero;
    }

    atenderTicket( escritorio) {
        // no tenemos tickets ya lo dimos todo
        if(this.tickets.length === 0){
            return null
        }
    
        // Quitaremos de la lista , //*tickets tiene los objetos de Ticket 
        const ticket = this.tickets.shift() //remueve el primer elemento del arreglo y lo retorna
        
        // *aqui usa ese objeto extraido de arriba
        ticket.escritorio = escritorio; //ahora este es el ticket que quiero atender ahora

        this.ultimo4.unshift(ticket) //añade un elemento nuevo pero al inicio

        // ahora validamos que siempre sea 4 elementos
        if (this.ultimo4.length > 4) {
            // -1 : ultima posicion del arregloy 1 : solo corta uno
            this.ultimo4.splice(-1 , 1) // cortamos el ultimo elemento de los 4 
        }
        this.guardarDB()

        return ticket

    }
    
}

module.exports = TicketControl