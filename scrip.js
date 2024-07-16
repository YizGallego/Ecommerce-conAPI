import { productos } from './productos.js';

document.addEventListener('DOMContentLoaded', function() {
  const carrito = [];  
  const listaCarrito = document.querySelector('#lista-carrito tbody');
  const cantidadCarrito = document.querySelector('#cantidad-carrito');
  const totalCarrito = document.querySelector('#total-carrito');
  const pagarCarrito = document.querySelector('#pagar-carrito');
  const customerForm = document.querySelector('#customer-form');
  const vaciarCarritoBtn = document.getElementById('Vaciar-carrito');

  const tooltips = document.querySelectorAll('.info-tooltip');

  tooltips.forEach(tooltip => {
    const link = tooltip.parentNode;

    link.addEventListener('mouseenter', () => {
      tooltip.style.display = 'inline-block';
    });

    link.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });
  });

  // Función para agregar productos al carrito
  function agregarCarrito(id) {
    const producto = productos.find(p => p.id === id);
    const existeEnCarrito = carrito.find(p => p.id === id);

    if (existeEnCarrito) {
      existeEnCarrito.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    renderizarCarrito();
  }

  // Función para renderizar el carrito
  function renderizarCarrito() {
    listaCarrito.innerHTML = '';
    carrito.forEach(producto => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td><img src="${producto.imagen}" width="50"></td>
        <td>${producto.nombre}</td>
        <td>${producto.precio}</td>
        <td>
          <input type="number" value="${producto.cantidad}" min="1" onchange="actualizarCantidad(${producto.id}, this.value)">
        </td>
        <td><button onclick="eliminarProducto(${producto.id})">Eliminar</button></td>
      `;
      listaCarrito.appendChild(fila);
    });

    cantidadCarrito.textContent = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    totalCarrito.textContent = `Total: $${carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0)}`;
  }

  // Función para actualizar la cantidad de un producto
  window.actualizarCantidad = function(id, cantidad) {
    const producto = carrito.find(p => p.id === id);
    producto.cantidad = Math.max(1, parseInt(cantidad) || 1);
    renderizarCarrito();
  }

  // Función para eliminar un producto del carrito
  window.eliminarProducto = function(id) {
    const index = carrito.findIndex(p => p.id === id);
    carrito.splice(index, 1);
    renderizarCarrito();
  }

  // Función para vaciar el carrito
  function vaciarCarrito() {
    carrito.length = 0;
    renderizarCarrito();
  }

  if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
  }

  // Evento para agregar productos al carrito
  const botonesAgregar = document.querySelectorAll('.agregar-carrito');
  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
      const id = parseInt(boton.dataset.id);
      agregarCarrito(id);
    });
  });

  function mostrarProcesoPago() {
    let seccionPago = document.getElementById('seccion-pago');
    let contenedorPago = document.getElementById('contenedor-pago');

    if (seccionPago && contenedorPago) {
        // Si el contenedor ya existe, lo limpiamos antes de agregar el nuevo contenido
        contenedorPago.innerHTML = '';
    } else {
        console.error('El contenedor de pago no se encontró en el DOM');
        return; // Salimos de la función si no se encuentra el contenedor
    }

    // Agregamos el contenido del formulario de pago
    contenedorPago.innerHTML = `
        <h2>Proceso de Pago</h2>
        <form id="form-pago">
            <input type="text" placeholder="Nombre" required>
            <input type="email" placeholder="Email" required>
            <input type="text" placeholder="Dirección" required>
            <button type="submit">Finalizar Compra</button>
        </form>
    `;

    console.log('Contenido del formulario de pago agregado');
    contenedorPago.style.setProperty('display', 'block', 'important');
    console.log('Contenedor de pago hecho visible');

    const formPago = document.getElementById('form-pago');
    if (formPago) {
      formPago.addEventListener('submit', function(e) {
        e.preventDefault();
        const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
        iniciarPagoWompi(total);
      });
    } else {
      console.error('El formulario de pago no se encontró en el DOM');
    }
  }

  // Event listener para el botón de pagar
  if (pagarCarrito) {
    pagarCarrito.addEventListener('click', function() {
      console.log('Botón de pagar clickeado');
      if (carrito.length > 0) {
        console.log('Carrito no está vacío, mostrando proceso de pago');
        mostrarProcesoPago();
      } else {
        console.log('Carrito está vacío');
        alert('El carrito está vacío');
      }
    });
  } else {
    console.error('El botón de pagar no se encontró en el DOM');
  }

  if (customerForm) {
    customerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerData = {
        email: document.getElementById('customer-email').value,
        fullName: document.getElementById('customer-name').value,
        phoneNumber: document.getElementById('customer-phone').value,
      };
      const total = carrito.reduce((acc, p) => acc + (p.precio * p.cantidad), 0);
      iniciarPagoWompi(total, customerData);
    });
  }

  function iniciarPagoWompi(total, customerData) {
    var checkout = new WidgetCheckout({
      currency: 'COP',
      amountInCents: total * 100,
      reference: 'ORDEN-' + Date.now(),
      publicKey: 'pub_prod_JcynFAKL3teJbapjK1c5Ox1Oaz1R5IBW',
    });

    checkout.open(function (result) {
      var transaction = result.transaction;
      console.log('Transacción finalizada', transaction);
      if (transaction.status === 'APPROVED') {
        alert('Pago aprobado. ID de transacción: ' + transaction.id);
        vaciarCarrito();
      } else {
        alert('El pago no fue aprobado');
      }
    });
  }
});






  
                                                                                          