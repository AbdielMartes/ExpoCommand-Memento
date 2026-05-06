
// Clase Originadora llamada Persona, que tiene un estado definido por un tipo String
class Persona {
    private estado : string;

    constructor(estado : string) {
        this.estado = estado;
        console.log(`Mi estado actual es: ${this.estado}`);
    }

    public estudiar() : void {
        console.log('Ahora mismo voy a estudiar.');
        this.estado = 'Estudiando';
        console.log(`Mi estado actual es: ${this.estado}`);
    }

    public dejarEstudiar() : void {
        console.log('Ya terminé de estudiar.');
        this.estado = 'Despierto';
        console.log(`Mi estado actual es: ${this.estado}`);
    }

    public dormir() : void {
        console.log('Ya voy a dormir.');
        this.estado = 'Dormido';
        console.log(`Mi estado actual es: ${this.estado}`);
    }

    // Siendo la clase Originadora de Mementos, puede guardar y restaurar
    // estados anteriores de sí misma

    public guardarEstado() : Memento {
        return new implementacionMementoPersona(this.estado);
    }

    public restaurar(memento: Memento | undefined) : void {
        // @ts-ignore
        this.estado = memento.getEstado();
        console.log(`Mi estado ha cambiado a: ${this.estado}`);
    }

}

// La interface de Memento y su implementación para el guardado de estado de un objeto Persona

interface Memento {
    getEstado() : string;
    getNombre() : string;
    getFecha() : string;
}


class implementacionMementoPersona implements Memento {
    private estado: string;
    private fecha: string;

    constructor(estado: string) {
        this.estado = estado;
        this.fecha = new Date().toISOString().slice(0, 19).replace(/T/, '');
    }

    public getEstado(): string{
        return this.estado;
    }

    public getNombre(): string {
        return `${this.fecha} / (${this.estado.substr(0, 10)}...)`;
    }

    public getFecha(): string {
        return this.fecha;
    }

}

// El guardián manda la señal de crear un memento o volver al estado anterior según se deseé

class GuardianDeMemento {
    private listaMementos : Memento[] = [];
    private persona: Persona;

    constructor(originador : Persona) {
        this.persona = originador;
    }

    public guardarMemento() : void {
        console.log('\nGuardian: Guardando el estado de la persona...');
        this.listaMementos.push(this.persona.guardarEstado());
    }

    public deshacer(): void {
        if (!this.listaMementos.length) {
            return;
        }
        const memento = this.listaMementos.pop();

        // @ts-ignore
        console.log(`Restaurando el estado de la persona a ${memento.getNombre()} `);
        this.persona.restaurar(memento);
    }

    public mostrarHistorial(): void {
        console.log('\nHistorial de mementos:');
        for (const memento of this.listaMementos) {
            console.log(memento.getNombre());
        }
    }

}

// Código de ejecución

const persona = new Persona('Despierto');
const guardian = new GuardianDeMemento(persona);

guardian.guardarMemento();
persona.estudiar();

guardian.guardarMemento();
persona.dejarEstudiar();

console.log('\nVoy a volver a estudiar\n');
guardian.deshacer();

guardian.guardarMemento();
persona.dejarEstudiar();

guardian.guardarMemento();
guardian.mostrarHistorial();

console.log('\nOtra vez a estudiar');
persona.estudiar();
guardian.guardarMemento();

console.log('\nDejare de estudiar');
persona.dejarEstudiar();
guardian.guardarMemento();

console.log('\nVoy a dormir mejor');
persona.dormir();
guardian.guardarMemento();

guardian.mostrarHistorial();

