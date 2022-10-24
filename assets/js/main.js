let codigo = 0,
    cantProductos = 0,
    detalleProducto = '',
    cantidadProducto = 0,
    precioUnitarioProducto = 0.0,
    precioTotal = 0.0;
    
const porcentajeIVA = 0.12;
let arrProductos = [];

let productTableRef = document.querySelector('#productTable');
let subtotalPagar = document.querySelector('#subtotalPagar');
let ivaPagar = document.querySelector('#ivaPagar');
let totalPagar = document.querySelector('#totalPagar');
const frmProducto = document.getElementById('formProducto');

// CLASE PRODUCTOS
class Producto {
    constructor(codigo, detalle, cantidad, precioUnitario,precioTotal){
        this.codigo = codigo;
        this.detalle = detalle;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.precioTotal = precioTotal
    }
}


document.addEventListener("DOMContentLoaded", () => {
    arrProductos = JSON.parse(localStorage.getItem("productos")) || [];
    agregarProductosTabla();
});


/** ESTA FUNCION SE ENCARGA DEL CALCULO DE LOS VALORES
- SUBTOTAL
- IVA
- TOTAL */
const calcularMontosPagar = () => {
    let subTotal = 0.0;
    let total = 0.0;

    if(arrProductos.length > 0 ){
        arrProductos.forEach((element) => {
            subTotal += (element.precioUnitario * element.cantidad);
        });
    }

    let iva = subTotal * porcentajeIVA;
    total = subTotal + iva;

    subtotalPagar.textContent = `$${subTotal.toFixed(2)}`;
    ivaPagar.textContent = `$${iva.toFixed(2)}`;
    totalPagar.textContent = `$${total.toFixed(2)}`;
};


/** ESTA FUNCION PERMITE AGREGAR LOS REGISTROS QUE ESTEN CARGADOS EN
EL ARRAY arrProductos */
const agregarProductosTabla = () => {
    productTableRef.innerHTML = ``;

    arrProductos.forEach((element, index) => {
        productTableRef.innerHTML += `<tr>
            <td class="text-center">${index+1}</td>
            <td class="text-center">${element.detalle}</td>
            <td class="text-center">${element.cantidad}</td>
            <td class="text-center">${element.precioUnitario.toFixed(2)}</td>
            <td class="text-center">${element.precioTotal.toFixed(2)}</td>
            <td class="text-center"><a href="#" id="${element.codigo}" class="btn btn-outline-danger borrar-curso" data-id="1"><i
            class="fa-solid fa-trash" ></i> Eliminar</a></td>
        </tr>`;

    });
    calcularMontosPagar();

    let botonEliminar = document.querySelectorAll('#productTable tr td a');
    botonEliminar.forEach(element => {
        element.addEventListener('click',(e)=>{

            Swal.fire({
                title: '¿Está seguro?',
                text: "No podrás revertir esto.!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, eliminar!'
            }).then((result) => {
                if (result.isConfirmed) {

                    e.preventDefault();
                    let id = parseInt(e.target.id);
                    arrProductos = arrProductos.filter( producto => producto.codigo !== id );
                    guardarLocalStorage();
                    agregarProductosTabla()

                    Swal.fire(
                        'Eliminado!',
                        'El registro ha sido eliminado.',
                        'Éxito'
                    )
                }
            });
        })
    })

};


/** FUNCION QUE SE ALMACENA EL ARRAY DE PRODUCTOS EN EL LOCALSTORAGE CADA 
QUE SE AGREGA UN NUEVO PRODUCTO */
const guardarLocalStorage = () => {
    localStorage.setItem("productos", JSON.stringify(arrProductos));
};


/** EVENTO SUBMIT DEL FORMULARIO */
frmProducto.addEventListener('submit', (event) => {
    event.preventDefault();
    let datosFormulario = new FormData(frmProducto);
    agregarProducto(datosFormulario);
    frmProducto.reset();
});


/** FUNCION MEDIANTE LA CUAL SE AGREGA UN NUEVO PRODUCTO AL ARRAY 
 * arrProducto
 */
const agregarProducto = (datosFormulario) => {
    codigo = Math.floor(Math.random() * 10000);
    detalleProducto = datosFormulario.get('detalle');
    cantidadProducto = parseInt(datosFormulario.get('cantidad'));
    precioUnitarioProducto = parseFloat(datosFormulario.get('precioUnitario'));
    precioTotal = (cantidadProducto * precioUnitarioProducto);

    let nuevoProducto = new Producto(codigo, detalleProducto, cantidadProducto, precioUnitarioProducto, precioTotal);
    arrProductos.push(nuevoProducto);

    $('#exampleModal').modal('hide')

    guardarLocalStorage();
    agregarProductosTabla();

    
};



