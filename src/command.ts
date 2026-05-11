interface Transaccion {
    nombre: string;
    timestamp: Date;
    execute(): boolean; // Exito
    undo(): void;      // Revierte la operacion
}

class CuentaBancaria { // RECEIVER
    private saldo: number;

    constructor(public titular: string, saldoInicial: number) {
        this.saldo = saldoInicial;
    }

    public realizarDeposito(monto: number): void {
        this.saldo += monto;
        console.log(`[VERIFICADO] DEPOSITO: $${monto}. Saldo actual: $${this.saldo}`);
    }

    public realizarRetiro(monto: number): boolean {
        if (monto <= this.saldo) {
            this.saldo -= monto;
            console.log(`[VERIFICADO] RETIRO: $${monto}. Saldo actual: $${this.saldo}`);
            return true;
        }
        console.log(`[ERROR] Fondos insuficientes para retirar $${monto}.`);
        return false;
    }

    public consultarSaldo(): number {
        return this.saldo;
    }
}

// COMMAND: Deposito
class DepositoCommand implements Transaccion {
    public nombre = "DEPOSITO";
    public timestamp: Date = new Date();

    constructor(private cuenta: CuentaBancaria, private monto: number) {}

    public execute(): boolean {
        this.cuenta.realizarDeposito(this.monto);
        return true;
    }

    public undo(): void {
        console.log(`Revirtiendo deposito de $${this.monto}...`);
        this.cuenta.realizarRetiro(this.monto);
    }
}

// COMMAND: Retiro
class RetiroCommand implements Transaccion {
    public nombre = "RETIRO";
    public timestamp: Date = new Date();

    constructor(private cuenta: CuentaBancaria, private monto: number) {}

    public execute(): boolean {
        return this.cuenta.realizarRetiro(this.monto);
    }

    public undo(): void {
        console.log(`Revirtiendo retiro de $${this.monto}...`);
        this.cuenta.realizarDeposito(this.monto);
    }
}

class ProcesadorBancario { // INVOKER
    private historial: Transaccion[] = [];

    public procesar(comando: Transaccion): void {
        console.log(`\nIniciando ${comando.nombre} - ${comando.timestamp.toISOString()}`);

        const exito = comando.execute();

        if (exito) {
            this.historial.push(comando);
        } else {
            console.log("Transaccion fallida. No se registrara en la auditoría.");
        }
    }

    public deshacerUltimaAccion(): void {
        const comando = this.historial.pop();
        if (comando) {
            console.log(`\n--- DESHACIENDO: ${comando.nombre} ---`);
            comando.undo();
        } else {
            console.log("\nNo hay transacciones para deshacer.");
        }
    }

    public verAuditoria(): void {
        console.log("\n--- HISTORIAL DE AUDITORIA ---");
        if (this.historial.length === 0) console.log("Vacio.");
        this.historial.forEach((t, i) => {
            console.log(`${i + 1}. [${t.timestamp.toLocaleTimeString()}] ${t.nombre}`);
        });
        console.log("-----------------------------------------------");
    }
}

const miCuenta = new CuentaBancaria("Carlos Martinez", 1000);
const cajero = new ProcesadorBancario();

// 1. Depósito
cajero.procesar(new DepositoCommand(miCuenta, 500));

// 2. Retiro
cajero.procesar(new RetiroCommand(miCuenta, 200));

// 3. Falla
cajero.procesar(new RetiroCommand(miCuenta, 5000));

cajero.verAuditoria();

// 4. Ejemplo Deshacer
cajero.deshacerUltimaAccion();

// Ver estado final
cajero.verAuditoria();
console.log(`Saldo final en cuenta: $${miCuenta.consultarSaldo()}`);