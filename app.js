
const contenedorProductos = document.getElementById('contenedor-productos')



const contenedorCarrito = document.getElementById('carrito-contenedor')

const botonVaciar = document.getElementById('vaciar-carrito')

const contadorCarrito = document.getElementById('contadorCarrito')


const cantidad = document.getElementById('cantidad')
const precioTotal = document.getElementById('precioTotal')
const cantidadTotal = document.getElementById('cantidadTotal')
const procesarCompra = document.querySelector('#procesarCompra')

let carrito = []

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        actualizarCarrito()
    }
})

botonVaciar.addEventListener('click', () => {
    carrito = []
    actualizarCarrito()
    localStorage.clear()
})

if (procesarCompra) {
    procesarCompra.addEventListener("click", () => {
      if (carrito.length === 0) {
        Swal.fire({
          title: "¡Tu carrito está vacio!",
          text: "Compra algo para continuar con la compra",        //alerta rechazo
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } else {
        Swal.fire({
            title: "¡Tu compra se a realiado con exito!",
            text: "muchas gracias por confiar en nosotros",        //alerta de compra
            icon: "success",
            confirmButtonText: "Aceptar",
          });
      }
    });
  }

//
const consultarProductos = async () => {
    const response = await fetch('./json/stock.json')
    const productos = await response.json()
    return productos 
}

let a = []

consultarProductos().then(stockProductos => {
    stockProductos.forEach((producto) => {
        const div = document.createElement('div')
        div.classList.add('producto')
        div.innerHTML = `
        <img src=${producto.img} alt= "">
        <h3>${producto.nombre}</h3>
        <p>${producto.desc}</p>
        <p>Talle: ${producto.talle}</p>
        <p class="precioProducto">Precio:$ ${producto.precio}</p>
        <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i></button>

        `
        contenedorProductos.appendChild(div)
        a.push(producto)
        
        const boton = document.getElementById(`agregar${producto.id}`)


        boton.addEventListener('click', () => {
            
            agregarAlCarrito(producto.id)
            
        })
    })
})

console.log(a)
const agregarAlCarrito = (prodId) => {

    const existe = carrito.some (prod => prod.id === prodId) 

    if (existe){
        const prod = carrito.map (prod => {
            
            if (prod.id === prodId){
                prod.cantidad++
            }
        })
    } else { 
        const item = a.find((prod) => prod.id === prodId)

        carrito.push(item)
    }

    actualizarCarrito()
} 



const eliminarDelCarrito = (prodId) => {
    const item = carrito.find((prod) => prod.id === prodId)

    const indice = carrito.indexOf(item) 

    carrito.splice(indice, 1) 
     
    actualizarCarrito()  
    
    console.log(carrito)
}

const actualizarCarrito = () => {
    
    contenedorCarrito.innerHTML = "" 

    carrito.forEach((prod) => {
        const div = document.createElement('div')
        div.className = ('productoEnCarrito')
        div.innerHTML = `
        <p>${prod.nombre}</p>
        <p>Precio:$${prod.precio}</p>
        <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
        <button onclick="eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        `
        contenedorCarrito.appendChild(div)
        
        localStorage.setItem('carrito', JSON.stringify(carrito))

    })
   
    contadorCarrito.innerText = carrito.length 
    
    console.log(carrito)
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.cantidad * prod.precio, 0)
}

