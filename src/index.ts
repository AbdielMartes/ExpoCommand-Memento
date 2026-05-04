console.log('Happy developing ✨')

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

    public guardarEstado() : Memento {
        return new implementacionMemento(this.estado);
    }

    public restaurar(memento: Memento | undefined) : void {
        // @ts-ignore
        this.estado = memento.getEstado();
        console.log(`Mi estado ha cambiado a: ${this.estado}`);
    }

}

interface Memento {
    getEstado() : string;

    getNombre() : string;

    getFecha() : string;

}

class implementacionMemento implements Memento {
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

class GuardianDeMemento {
    private mementos : Memento[] = [];

    private persona: Persona;

    constructor(originador : Persona) {
        this.persona = originador;
    }

    public guardarMemento() : void {
        console.log('\nGuardian: Guardando el estado de la persona...');
        this.mementos.push(this.persona.guardarEstado());
    }

    public deshacer(): void {
        if (!this.mementos.length) {
            return;
        }

        const memento = this.mementos.pop();

        // @ts-ignore
        console.log(`Restaurando el estado de la persona a ${memento.getNombre()} `);
        this.persona.restaurar(memento);
    }

    public mostrarHistorial(): void {
        console.log('\nHistorial de mementos:');
        for (const memento of this.mementos) {
            console.log(memento.getNombre());
        }
    }

}

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

guardian.mostrarHistorial();

console.log('\nOtra vez a estudiar\n');
guardian.deshacer();

console.log('\nDejare de estudiar\n');
persona.dejarEstudiar();

console.log('\nVoy a dormir mejor\n');
persona.dormir();

