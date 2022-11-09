let codigo = 0,
    cantProductos = 0,
    detalleProducto = '',
    cantidadProducto = 0,
    precioUnitarioProducto = 0.00,
    precioTotal = 0.00;
    
const porcentajeIVA = 0.12;
let arrProductos = [];

const insertDOMcontent = document.querySelector('#insertDOMcontent')
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
    consultarAPI();
});


const imprimirProductos = (productosAPI) => {
    if( productosAPI !== undefined ){
        productosAPI.forEach( element => {
            const {id, title, price, image} = element;
            insertDOMcontent.innerHTML += `<div class="col-6 col-md-4 col-lg-3 my-3 card-p">
            <div class="card  h-100">
                <img src="${image}" class="card-img-top imgShop" alt="${title}">
                <div class="card-body">
                <div class="info-card">
                    <h5 class="card-title titulo-producto">${title}</h5>
                    <small></small>
                    <p class="precio">
                        <span class="u-pull-right col-8 titulo-precio">$${price}</span>
                        <input class="col-4 cantidad" type="number" value="1" min="1" max="100">
                    </p>
                    <hr>
                    <p class="card-text"><a href="#" class="btn btn-primary w-100 btn-agregar" id="${id}" >Agregar</a></p>
                </div>
                </div>
            </div>
        </div>`;
        });
    }
}

const seleccionarProductoAPI = (id, cantidad, productosCargadosAPI) => {
    let productoSeleccionado = productosCargadosAPI.find((element) => id == element.id);
    datos = {
        id: productoSeleccionado.id,
        detalle: productoSeleccionado.title,
        cantidad: cantidad,
        precio: productoSeleccionado.price
    }
    
    agregarProductoAPI(datos);
}


/** ESTA FUNCION CARGA LOS PRODUCTOS DESDE EL API */
const consultarAPI = () => {
    // PETICION AL API
    fetch(`https://fakestoreapi.com/products`).then( response => {

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        response.json().then( response => {
            imprimirProductos(response);
            
            let buttonCard = document.querySelectorAll(".btn-agregar");
            let cantidadSeleccionado = document.querySelectorAll(".cantidad");

            // Recorremos los botones asocimaos a un escuchador de eventos
            buttonCard.forEach((element, index) => {
                element.addEventListener("click", (e) => {

                    e.preventDefault();
                    let id = e.target.id;
                    let cantidad = cantidadSeleccionado[index].value;
                    seleccionarProductoAPI(id, cantidad, response);
                });
            });
        })
    }).catch( error => {

    })
}


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

    if(arrProductos.length > 0 ){
        arrProductos.forEach((element, index) => {
            productTableRef.innerHTML += `<tr>
                <td class="text-center">${index+1}</td>
                <td class="text-center">${element.detalle}</td>
                <td class="text-center">${element.cantidad}</td>
                <td class="text-center">${element.precioUnitario.toFixed(2)}</td>
                <td class="text-center">${element.precioTotal.toFixed(2)}</td>
                <td class="text-center"><a href="#" id="${element.codigo}" class="btn btn-outline-danger borrar-curso"><i
                class="fa-solid fa-trash" ></i> Eliminar</a></td>
            </tr>`;
        });
    }
    
    calcularMontosPagar();

    let botonEliminar = document.querySelectorAll('#productTable tr td a');
    botonEliminar.forEach(element => {
        element.addEventListener('click',(e)=>{

            Swal.fire({
                title: '¿Está seguro?',
                text: "No podrás revertir esto!",
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
                        'success'
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


/** FUNCION MEDIANTE LA CUAL SE AGREGA UN NUEVO PRODUCTO AL ARRAY POR MEDIO DEL FORMULARIO
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
    Swal.fire(
        'Agregado!',
        'El producto ha sido agregado.',
        'success'
    );
};


/** FUNCION MEDIANTE LA CUAL SE AGREGA UN NUEVO PRODUCTO AL ARRAY SELECCIONADO DEL API
 * arrProducto
 */
const agregarProductoAPI = (datosProducto) => {
    
    codigo = datosProducto.id;
    detalleProducto = datosProducto.detalle;
    cantidadProducto = datosProducto.cantidad;
    precioUnitarioProducto = parseFloat(datosProducto.precio);
    precioTotal = (cantidadProducto * precioUnitarioProducto);

    let buscarProducto = arrProductos.filter(producto => producto.codigo == codigo );

    if( buscarProducto.length === 0 ){
        let nuevoProducto = new Producto(codigo, detalleProducto, cantidadProducto, precioUnitarioProducto, precioTotal);
        arrProductos.push(nuevoProducto);
        guardarLocalStorage();
        agregarProductosTabla();
        Swal.fire(
            'Agregado!',
            'El producto ha sido agregado.',
            'success'
        );
    }else{
        Swal.fire(
            'Upss!',
            'El producto ya se encuentra agregado.',
            'error'
        );
    }
};





