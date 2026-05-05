interface Transaccion { //Define el contrato de las transacciones
    execute(): void;
    timestamp: Date;
}

class CuentaBancaria {      //RECEIVER
    private saldo: number;  //Objeto encargado de gestionar el saldo sin saber acerca de los comandos

    constructor(public titular: string, saldoInicial: number) {
        this.saldo = saldoInicial;
    }

    public realizarDeposito(monto: number): void {
        this.saldo += monto;
        console.log(`DEPOSITO: $${monto} enviados a la cuenta de ${this.titular}.`);
        console.log(`   Saldo actual: $${this.saldo}`);
    }

    public realizarRetiro(monto: number): boolean {
        if (monto <= this.saldo) {
            this.saldo -= monto;
            console.log(`RETIRO: $${monto} entregados.`);
            console.log(`   Saldo actual: $${this.saldo}`);
            return true;
        }
        console.log(`ERROR: Fondos insuficientes para retirar $${monto}.`);
        return false;
    }

    public consultarSaldo(): number {
        return this.saldo;
    }
}

//COMMAND: Deposito y retiro
class DepositoCommand implements Transaccion {
    public timestamp: Date = new Date();

    constructor(
        private cuenta: CuentaBancaria,
        private monto: number
    ) {}

    public execute(): void {
        this.cuenta.realizarDeposito(this.monto);
    }
}

class RetiroCommand implements Transaccion {
    public timestamp: Date = new Date();

    constructor(
        private cuenta: CuentaBancaria,
        private monto: number
    ) {}

    public execute(): void {
        this.cuenta.realizarRetiro(this.monto);
    }
}

class ProcesadorBancario {          //INVOKER, aqui se ejecutan los comandos desde los procesos hasta el historial
    private historial: Transaccion[] = [];

    public procesar(comando: Transaccion): void {
        console.log(`\nProcesando transaccion del ${comando.timestamp.toISOString()}...`);
        comando.execute();
        this.historial.push(comando);
    }

    public verAuditoria(): void {
        console.log("\n--- HISTORIAL DE AUDITORIA BANCARIA ---");
        this.historial.forEach((t, i) => {
            const tipo = t instanceof DepositoCommand ? "DEPOSITO" : "RETIRO";
            console.log(`${i + 1}. [${t.timestamp.toLocaleTimeString()}] ${tipo}`);
        });
        console.log("---------------------------------------");
    }
}

// RECEIVER, se crea la cuenta del usuario donde se realiza las operaciones
const miCuenta = new CuentaBancaria("Carlos Martinez", 1000);

// se crea al INVOKER
const cajeroATM = new ProcesadorBancario();

// se llama a los COMMANDS
const operacion1 = new DepositoCommand(miCuenta, 500);
const operacion2 = new RetiroCommand(miCuenta, 200);
const operacion3 = new RetiroCommand(miCuenta, 2000); // ejemplo de error

// el INVOKER realiza las operaciones
cajeroATM.procesar(operacion1);
cajeroATM.procesar(operacion2);
cajeroATM.procesar(operacion3);

//muestra el historial
cajeroATM.verAuditoria();