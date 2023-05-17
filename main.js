class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

const productos = [
    new Producto("Manzanas", 2.5),
    new Producto("Naranjas", 1.8),
    new Producto("Bananas", 3.2),
    new Producto("Peras", 2.0),
    new Producto("Sandías", 5.0),
    new Producto("Papayas", 4.5)
];

function mostrarMenu() {
    let menu = "======    Marketplace de Frutas y Verduras    ======\n"; // Título del menú
    // Filtrar productos en oferta
    const productosEnOferta = productos.filter((producto) => producto.precio < 2.5);
    if (productosEnOferta.length > 0) {
        menu += "\n--- Productos en oferta ---\n";
        productosEnOferta.forEach((producto, index) => {
            menu += ` * ${producto.nombre}: $${producto.precio}\n`;
        });
    }
    menu += "\n--- Menú de productos ---\n";
    const columnWidth = Math.ceil(productos.length / 2); // Ancho de cada columna
    for (let i = 0; i < columnWidth; i++) {
        const leftIndex = i;
        const rightIndex = i + columnWidth;
        const leftProduct = productos[leftIndex];
        const rightProduct = productos[rightIndex];
        const leftLine = `${leftIndex + 1}. ${leftProduct ? `${leftProduct.nombre}: $${leftProduct.precio}` : ""}`;
        const rightLine = `${rightIndex + 1}. ${rightProduct ? `${rightProduct.nombre}: $${rightProduct.precio}` : ""}`;
        menu += `${leftLine.padEnd(30)} ${rightLine}\n`;
    }
    return menu;
}

function obtenerEleccion() {
    let eleccion = parseInt(prompt(mostrarMenu() + "\nIngrese el número del producto que desea comprar:"));
    if (isNaN(eleccion)) {
        return null; // Finalizar el programa si se hizo clic en "Cancelar"
    }
    while (eleccion < 1 || eleccion > productos.length) {
        eleccion = parseInt(prompt("Eleccion invalida, por favor ingrese un número del 1 al " + productos.length));
    }
    return eleccion;
}

function comprar() {
    let carrito = [];
    let seguirComprando = true;

    while (seguirComprando) {
        const eleccion = obtenerEleccion();
        if (eleccion === null) {
            return null; // Finalizar el programa si se hizo clic en "Cancelar"
        }
        const productoElegido = productos[eleccion - 1];
        carrito.push(productoElegido);
        alert(`¡Añadiste ${productoElegido.nombre} al carrito!`);

        const seguir = prompt(`¿Desea seguir comprando?\n1. Sí\n2. No`);
        switch (seguir) {
            case "1":
                break;
            case "2":
                seguirComprando = false;
                break;
            case null:
                return null; // Finalizar el programa si se hizo clic en "Cancelar"
            default:
                alert("Eleccion invalida, por favor seleccione 1 o 2");
        }
    }
    mostrarResumenCompra(carrito);
    mostrarProductosEconomicos();
}

function mostrarResumenCompra(carrito) {
    let resumen = "--- Resumen de compra ---\n";
    let total = 0;

    carrito.forEach((producto, index) => {
        resumen += `${index + 1}. ${producto.nombre}: $${producto.precio}\n`;
        total += producto.precio;
    });
    resumen += `-------------------------\nTotal: $${total.toFixed(2)}`;
    alert(resumen);
}
comprar();
