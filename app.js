const products = [
  {
    id: 'arandanos-limon',
    name: 'Queque de arándanos y limón',
    category: 'queques',
    categoryLabel: 'Queques & kuchenes',
    price: 10000,
    image: 'assets/productos/producto-04.png',
    description: 'Miga suave y liviana, con el sabor de arándanos frescos en cada trozo y un toque cítrico: jugo de limón fresco que realza la acidez de los arándanos.',
  },
  {
    id: 'arandanos-yogurt',
    name: 'Queque de arándanos y yogurt',
    category: 'queques',
    categoryLabel: 'Queques & kuchenes',
    price: 10000,
    image: 'assets/productos/producto-11.png',
    description: 'La misma miga suave de siempre, con un sabroso glaseado de arándanos. Un equilibrio delicado entre dulce y frutal.',
  },
  {
    id: 'naranja-yogurt',
    name: 'Queque de naranja y yogurt',
    category: 'queques',
    categoryLabel: 'Queques & kuchenes',
    price: 10000,
    image: 'assets/productos/producto-01.png',
    description: 'Esponjoso y húmedo, con el aroma fresco de naranjas recién ralladas y un dulzor justo. Ideal para acompañar el café de la tarde.',
  },
  {
    id: 'queque-platano',
    name: 'Queque de plátano',
    category: 'queques',
    categoryLabel: 'Queques & kuchenes',
    price: 10000,
    image: 'assets/productos/producto-03.png',
    description: 'Plátanos que aportan humedad y dulzor natural, a elección con nueces o chips de chocolate.',
  },
  {
    id: 'kuchen-nuez',
    name: 'Kuchen de nuez',
    category: 'queques',
    categoryLabel: 'Queques & kuchenes',
    price: 12500,
    image: 'assets/productos/producto-05.png',
    description: 'Base crocante que envuelve un relleno cremoso de nueces caramelizadas. Sabor profundo y tostado.',
  },
  {
    id: 'kuchen-sureno',
    name: 'Kuchen sureño',
    category: 'queques',
    categoryLabel: 'Queques & kuchenes',
    price: 12500,
    image: 'assets/productos/producto-02.png',
    description: 'Kuchen con relleno generoso de frutos rojos y crema de leche. Un viaje directo a la cocina de la abuela.',
  },
  {
    id: 'pie-manzana-nuez',
    name: 'Pie de manzana y nueces',
    category: 'tartas',
    categoryLabel: 'Tartas & pies',
    price: 12500,
    image: 'assets/productos/producto-06.png',
    description: 'Pie de manzana de masa suave, relleno con manzanas, nueces y una ligera crema pastelera. El aroma de un hogar, recién horneado.',
  },
  {
    id: 'tarta-zanahoria',
    name: 'Tarta de zanahoria',
    category: 'tartas',
    categoryLabel: 'Tartas & pies',
    price: 12500,
    image: 'assets/productos/producto-07.png',
    description: 'Suave bizcocho de zanahoria y nueces, con toques de canela y nuez moscada, cubierto con frosting de queso crema.',
  },
  {
    id: 'pie-limon',
    name: 'Pie de limón tipo tarta',
    category: 'tartas',
    categoryLabel: 'Tartas & pies',
    price: 12500,
    image: 'assets/productos/producto-10.png',
    description: 'Una alternativa distinta y deliciosa para fanáticos del pie de limón, lleva un bizcocho suave con una crema de limón y leche condensada, con el equilibrio justo entre dulce y ácido, coronada con crema chantilly o merengue (a elección).',
  },
  {
    id: 'carlota-limon',
    name: 'Carlota de limón',
    category: 'postres',
    categoryLabel: 'Postres',
    price: 12500,
    image: 'assets/productos/producto-08.png',
    description: 'Capas de galleta crujientes y crema de limón fresca, con la acidez justa para despertar los sentidos. Fresca, sedosa y liviana.',
  },
  {
    id: 'banana-split',
    name: 'Banana split',
    category: 'postres',
    categoryLabel: 'Postres',
    price: 12500,
    image: 'assets/productos/producto-09.png',
    description: 'Masa crujiente con capas de plátano fresco, manjar, crema chantilly y salsa de chocolate.',
  },
];

const money = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});
const productGrid = document.querySelector('#product-grid');
const emptyState = document.querySelector('#empty-state');
const searchInput = document.querySelector('#product-search');
const resultLabel = document.querySelector('#results-label');
const cartDrawer = document.querySelector('#cart-drawer');
const drawerScrim = document.querySelector('#drawer-scrim');
const cartItems = document.querySelector('#cart-items');
const cartEmpty = document.querySelector('#cart-empty');
const drawerFooter = document.querySelector('#drawer-footer');
const cartCount = document.querySelector('#cart-count');
const toast = document.querySelector('#toast');
const siteHeader = document.querySelector('.site-header');
const menuToggle = document.querySelector('#menu-toggle');
let activeCategory = 'todos';
let toastTimeout;
let cart = loadCart();

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem('sabores-del-sur-cart') || '[]');
    return new Map(stored.filter(([id, quantity]) => products.some((product) => product.id === id) && quantity > 0));
  } catch {
    return new Map();
  }
}

function saveCart() {
  localStorage.setItem('sabores-del-sur-cart', JSON.stringify([...cart]));
}

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function renderProducts() {
  const query = normalize(searchInput.value);
  const visibleProducts = products.filter((product) => {
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    const matchesSearch = !query || normalize(`${product.name} ${product.description} ${product.categoryLabel}`).includes(query);
    return matchesCategory && matchesSearch;
  });

  productGrid.innerHTML = visibleProducts.map((product, index) => `
    <article class="product-card" style="animation-delay:${Math.min(index * 45, 300)}ms">
      <div class="product-photo">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <span class="product-category">${product.categoryLabel}</span>
      </div>
      <div class="product-content">
        <div class="product-name-row">
          <h3 class="product-name">${product.name}</h3>
          <span class="product-price">${money.format(product.price)}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-card-footer">
          <span class="product-note">Horneado a pedido</span>
          <button class="add-button" type="button" data-add="${product.id}" aria-label="Agregar ${product.name} al pedido"><span aria-hidden="true">+</span> Agregar</button>
        </div>
      </div>
    </article>
  `).join('');

  emptyState.hidden = visibleProducts.length > 0;
  resultLabel.innerHTML = `${activeCategory === 'todos' ? 'Nuestras recetas' : 'Mostrando'} <span>·</span> ${visibleProducts.length} ${visibleProducts.length === 1 ? 'delicia' : 'delicias'}`;
}

function updateCategoryButtons(category) {
  document.querySelectorAll('.filter-button').forEach((button) => {
    const isActive = button.dataset.filter === category;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function renderCart() {
  const itemCount = [...cart.values()].reduce((total, quantity) => total + quantity, 0);
  const total = [...cart].reduce((sum, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return sum + (product ? product.price * quantity : 0);
  }, 0);

  cartCount.textContent = itemCount;
  cartEmpty.hidden = itemCount > 0;
  drawerFooter.hidden = itemCount === 0;
  cartItems.innerHTML = [...cart].map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    if (!product) return '';
    return `
      <article class="cart-line">
        <img src="${product.image}" alt="" />
        <div>
          <h3>${product.name}</h3>
          <p>${money.format(product.price)}</p>
          <div class="quantity-control" aria-label="Cantidad de ${product.name}">
            <button type="button" data-quantity="${id}" data-change="-1" aria-label="Quitar uno">−</button>
            <span>${quantity}</span>
            <button type="button" data-quantity="${id}" data-change="1" aria-label="Agregar uno">+</button>
          </div>
        </div>
        <span class="cart-line-total">${money.format(product.price * quantity)}</span>
      </article>
    `;
  }).join('');
  document.querySelector('#cart-total').textContent = money.format(total);

  const orderLines = [...cart].map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return product ? `• ${quantity} × ${product.name} — ${money.format(product.price * quantity)}` : '';
  }).filter(Boolean);
  const message = `Hola, quiero hacer este pedido en Sabores del Sur:\n${orderLines.join('\n')}\nTotal: ${money.format(total)}\n\nSé que los pedidos se coordinan con 48 horas de anticipación.`;
  document.querySelector('#checkout-link').href = `https://wa.me/56999361240?text=${encodeURIComponent(message)}`;
}

function setDrawerOpen(isOpen) {
  cartDrawer.classList.toggle('is-open', isOpen);
  drawerScrim.classList.toggle('is-visible', isOpen);
  cartDrawer.setAttribute('aria-hidden', String(!isOpen));
  document.body.classList.toggle('drawer-open', isOpen);
  if (isOpen) document.querySelector('#close-cart').focus();
}

function setMobileMenuOpen(isOpen) {
  siteHeader.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    updateCategoryButtons(activeCategory);
    renderProducts();
  });
});

searchInput.addEventListener('input', renderProducts);
productGrid.addEventListener('click', (event) => {
  const addButton = event.target.closest('[data-add]');
  if (!addButton) return;
  const { add: id } = addButton.dataset;
  cart.set(id, (cart.get(id) || 0) + 1);
  saveCart();
  renderCart();
  showToast(`${products.find((product) => product.id === id).name} agregado a tu pedido`);
});

cartItems.addEventListener('click', (event) => {
  const quantityButton = event.target.closest('[data-quantity]');
  if (!quantityButton) return;
  const id = quantityButton.dataset.quantity;
  const quantity = (cart.get(id) || 0) + Number(quantityButton.dataset.change);
  if (quantity > 0) cart.set(id, quantity);
  else cart.delete(id);
  saveCart();
  renderCart();
});

document.querySelector('#cart-trigger').addEventListener('click', () => setDrawerOpen(true));
document.querySelector('#close-cart').addEventListener('click', () => setDrawerOpen(false));
drawerScrim.addEventListener('click', () => setDrawerOpen(false));
document.querySelector('#browse-catalog').addEventListener('click', () => setDrawerOpen(false));
menuToggle.addEventListener('click', () => {
  setMobileMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});
document.querySelectorAll('.header-actions a').forEach((link) => {
  link.addEventListener('click', () => setMobileMenuOpen(false));
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 760) setMobileMenuOpen(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && cartDrawer.classList.contains('is-open')) setDrawerOpen(false);
  if (event.key === 'Escape' && siteHeader.classList.contains('menu-open')) {
    setMobileMenuOpen(false);
    menuToggle.focus();
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();

renderProducts();
renderCart();
