let cantProductos = 0,
    nombreProducto = '',
    cantidadProducto = 0,
    precioProducto = 0.0,
    subTotal = 0.0,
    total = 0.0;
    
const iva = 0.12;
const arrProductos = [];


// CLASE PRODUCTOS
class Producto {
    constructor(nombre, cantidad, precioUnitario){
        this._nombre = nombre;
        this._cantidad = cantidad;
        this._precioUnitario = precioUnitario;
    }

    // METODOS PARA OBTENER Y MODIFICAR VALORES
    getNombre() {
        return this._nombre;
    }

    setNombre(nombre) {
        this._nombre = nombre;
    }

    getCantidad() {
        return this._cantidad;
    }

    setCantidad(cantidad) {
        this._cantidad = cantidad;
    }

    getPrecioUnitario() {
        return this._precioUnitario;
    }

    setPrecioUnitario(precioUnitario) {
        this._precioUnitario = precioUnitario;
    }

    // METODOS GENERALES DE LA CLASE
    totalProducto() {
        return this._cantidad * this._precioUnitario;
    }
}



alert('Programa para calcular el monto total a pagar, en caso del que el monto sea mayor a $60.00 dolares se aplica un descuento del 5%');

do{
    cantProductos = prompt('Ingrese la cantidad de productos a registrar: ');
}while(isNaN(parseInt(cantProductos)));

for(let i=1; i <= cantProductos; i++){
    do{
        nombreProducto = prompt(`Ingrese el nombre del producto ${i}:`);
        cantidadProducto = parseInt(prompt(`Ingrese la cantidad del producto ${i}:`));
        precioProducto = parseFloat(prompt(`Ingrese el precio del producto ${i}:`));

        let nuevoProducto = new Producto(nombreProducto, cantidadProducto, precioProducto);
        arrProductos.push( nuevoProducto);

    }while(Number.isNaN(precioProducto));
}

// METODO PARA CALCULAR EL TOTAL A PAGAR POR LOS PRODUCTOS
const calcularTotal = () => {
    arrProductos.forEach((element) => {
        console.log(element);
        subTotal += element.totalProducto();
    })

    total = subTotal + (subTotal*iva);

    if(total > 60.00){
        let totalDescuento = total-(total*0.05)
        alert(`El subtotal es: ${subTotal.toFixed(2)} - Felicidades su total es mayor a $60, y es acreedor a un descuento del 5%, el total a pagar es: $${totalDescuento.toFixed(2)}`);
    }else{
        alert(`El subtotal es: ${subTotal.toFixed(2)} - El total a pagar con iva es: ${total.toFixed(2)}`)
    }
}


calcularTotal();




