// Elementos del DOM
const productosList = document.querySelector(".productos");
const carritoList = document.querySelector(".carrito__compra");
const carritoTotal = document.querySelector(".carrito");
const totalElement = document.querySelector(".total_compra_pagar");

// URLs y datos
const URLJSON = "../data/productos.json";
let productos = [];
let carrito = [];

// Clase Producto
class Producto {
  constructor(id, nombre, precio, categoria, stock, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.stock = stock;
    this.imagen = imagen;
  }
}

// Obtener los datos desde el JSON
const getData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

// Mostrar productos en el HTML
const mostrarProductos = () => {
  productos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    const { imagen, nombre, stock, precio } = producto;
    /*HTML*/
    div.innerHTML = `
      <div class="producto__img">
        <img src="${imagen}" alt="${nombre}"/>
      </div>
      <h3 class="producto__nombre">${nombre}</h3>
      <p class="producto__stock">Stock: ${stock} UN</p>
      <p class="producto__precio">Precio: $${precio}</p>
      <button class="producto__button">Agregar al carrito</button>
    `;
    productosList.appendChild(div);
  });
};

// Agregar producto al carrito
const addToCart = (e) => {
  if (e.target.classList.contains("producto__button")) {
    const producto = e.target.parentElement;
    const productoAgregado = getProductData(producto);
    agregarAlCarrito(productoAgregado);
  }
  e.stopPropagation();
};

// Obtener los datos del producto seleccionado
const getProductData = (producto) => {
  const nombre = producto.querySelector(".producto__nombre").textContent;
  const precio = producto.querySelector(".producto__precio").textContent.slice(9);
  const cantidad = 1;
  return { nombre, precio, cantidad };
};

// Agregar producto al carrito
const agregarAlCarrito = (productoAgregado) => {
  const existe = carrito.find((producto) => producto.nombre === productoAgregado.nombre);
  existe ? existe.cantidad++ : carrito.push(productoAgregado);
  mostrarCarrito();
  almacenarCarritoEnLocalStorage();
};

// Borrar producto del carrito
const borrarDelCarrito = (e) => {
  if (e.target.classList.contains("cancel-button")) {
    const producto = e.target.parentElement;
    const nombre = producto.querySelector("span:nth-child(2)").textContent;
    const productoBorrado = carrito.find((producto) => producto.nombre === nombre);
    productoBorrado.cantidad > 1 ? productoBorrado.cantidad-- : carrito.splice(carrito.indexOf(productoBorrado), 1);
    producto.remove();
    mostrarCarrito();
    mostrarTotal();
    almacenarCarritoEnLocalStorage();
  }
  e.stopPropagation();
};

// Vaciar el carrito
const vaciarCarrito = () => {
  carrito = [];
  carritoList.innerHTML = "";
  mostrarTotal();
  localStorage.clear();
};

// Mostrar el carrito
const mostrarCarrito = () => {
  carritoList.innerHTML = "";
  carrito.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("carrito__compra__info");
    const { nombre, precio, cantidad } = producto;
    /*HTML*/
    div.innerHTML = `
      <span>${cantidad}</span>
      <span>${nombre}</span>
      <span>$${precio}</span>
      <i class="bi bi-x-circle-fill cancel-button"></i>
    `;
    carritoList.appendChild(div);
  });
  mostrarTotal();
};

// Mostrar el total de la compra
const mostrarTotal = () => {
  const total = carrito.reduce((acc, producto) => acc + parseFloat(producto.precio) * producto.cantidad, 0);
  if (totalElement.firstChild) {
    const totalSpan = totalElement.querySelector("span:last-child");
    totalSpan.textContent = `$${total.toFixed(2)}`;
  } else {
    const div = document.createElement("div");
    div.innerHTML = `
        <span>Total</span>
        <span>$${total.toFixed(2)}</span>
      `;
    totalElement.appendChild(div);
  }
};

// Obtener los productos del JSON y mostrarlos en la página
const obtenerProductos = async () => {
  productos = (await getData(URLJSON)).map(
    (producto) =>
      new Producto(producto.id, producto.nombre, producto.precio, producto.categoria, producto.stock, producto.imagen)
  );
  mostrarProductos();
};

// Almacenar el carrito en el LocalStorage
const almacenarCarritoEnLocalStorage = () => {
  localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Cargar el carrito desde el LocalStorage
const cargarCarritoDesdeLocalStorage = () => {
  const carritoLocalStorage = localStorage.getItem("carrito");
  if (carritoLocalStorage) {
    carrito = JSON.parse(carritoLocalStorage);
    mostrarCarrito();
  }
};

// Eventos
productosList.addEventListener("click", addToCart);
carritoList.addEventListener("click", borrarDelCarrito);
carritoTotal.addEventListener("click", vaciarCarrito);

// Cargar el carrito al cargar la página
window.addEventListener("DOMContentLoaded", () => {
  cargarCarritoDesdeLocalStorage();
});

// Inicializar la página
obtenerProductos();
