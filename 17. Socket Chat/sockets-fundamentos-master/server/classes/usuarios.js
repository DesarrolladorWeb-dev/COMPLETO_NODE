


class Usuarios {
    constructor() {
        // va a  inicializar una arreglo de personas que estan coneectadas al chat 
        this.personas = [] 
    }

    agregarPersona(id , nombre, sala){

        // creamos un objeto 
        let persona = { id , nombre , sala  };   
        console.log(persona)
        // agregamos en la lista 
        this.personas.push(persona); 

        return this.personas; 
    }

    getPersona (id ) { 
        //[0] : El primer elemento que conincida con el id 
        //como filter regresas un nuevo arreglo  , es poreso que quiero la primera posicion solo quiero un registro
        let persona = this.personas.filter(persona => persona.id === id )[0]; 
        return persona; // si no encuentra sera undefined
    }

    getPersonas ( ) {
        return this.personas; 
    }
    getPersonasPorSala(sala) {
        // personas con la misma sala
        let personasEnSala = this.personas.filter(persona => persona.sala === sala)
        return personasEnSala;
    }


    borrarPersona(id) {

        let personaBorrada = this.getPersona(id) //tendremos la persona del id 

        // regresa un nuevo arreglo solo guardo todos lo que el id no son iguales - Elimina solo el id ingresado
        this.personas = this.personas.filter(persona => persona.id != id )

        return personaBorrada; //para mostrar la borrada
    }


}

module.exports = {
    Usuarios
}