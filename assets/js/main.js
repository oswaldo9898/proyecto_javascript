let cantProductos = 0;
let subTotal = 0.0;
let total = 0.0;
let valorProducto = 0;
let iva = 0.12;

alert('Programa para calcular el monto total a pagar, en caso del que el monto sea mayor a $60.00 dolares se aplica un descuento del 5%');

do{
    cantProductos = prompt('Ingrese la cantidad de productos a registrar: ');
}while(Number.isNaN(parseInt(cantProductos)));

for(let i=1; i <= cantProductos; i++){
    do{
        valorProducto = parseFloat(prompt(`Ingrese el valor del producto ${i}:`));
    }while(Number.isNaN(valorProducto));
    subTotal+=valorProducto; 
}

total = subTotal + (subTotal*iva);

if(total > 60.00){
    alert(`El subtotal es: ${subTotal}. Felicidades su total es mayor a $60, y es acreedor a un descuento del %5, el total a pagar es: $${total-(total*0.05)}`);
}else{
    alert(`El subtotal es: ${subTotal}. El total a pagar con iva es: ${total}`)
}