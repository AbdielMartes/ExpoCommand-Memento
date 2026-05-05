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

/**
 * 4. INVOKER (INVOCADOR)
 * El "Cajero Automático" o "App Bancaria".
 * Ejecuta comandos y mantiene un registro de auditoría.
 */

class ProcesadorBancario {
    private historial: Transaccion[] = [];

    public procesar(comando: Transaccion): void {
        console.log(`\nProcesando transacción del ${comando.timestamp.toISOString()}...`);
        comando.execute();
        this.historial.push(comando);
    }

    public verAuditoria(): void {
        console.log("\n--- HISTORIAL DE AUDITORÍA BANCARIA ---");
        this.historial.forEach((t, i) => {
            const tipo = t instanceof DepositoCommand ? "DEPÓSITO" : "RETIRO";
            console.log(`${i + 1}. [${t.timestamp.toLocaleTimeString()}] ${tipo}`);
        });
        console.log("---------------------------------------");
    }
}

/**
 * 5. CÓDIGO DEL CLIENTE
 * Donde todo se conecta.
 */

// Paso 1: Creamos la cuenta del usuario (Receiver)
const miCuenta = new CuentaBancaria("Juan Pérez", 1000);

// Paso 2: Creamos el procesador del banco (Invoker)
const cajeroATM = new ProcesadorBancario();

// Paso 3: Definimos las operaciones (Commands)
const operacion1 = new DepositoCommand(miCuenta, 500);
const operacion2 = new RetiroCommand(miCuenta, 200);
const operacion3 = new RetiroCommand(miCuenta, 2000); // Esto fallará por saldo

// Paso 4: El invoker ejecuta las operaciones
cajeroATM.procesar(operacion1);
cajeroATM.procesar(operacion2);
cajeroATM.procesar(operacion3);

// Paso 5: Revisamos el historial de lo que pasó
cajeroATM.verAuditoria();