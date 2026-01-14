// Cart functionality
let cartCount = 0;
let cartTotal = 0;
let cartItems = [];

const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartCountElement = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cartItems');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Toggle cart sidebar
cartBtn.addEventListener('click', () => {
  cartSidebar.classList.toggle('active');
});

closeCart.addEventListener('click', () => {
  cartSidebar.classList.remove('active');
});

// Function to render cart items in sidebar
function renderCartItems() {
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-cart"></i>
        <p>Dein Warenkorb ist leer</p>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cartItems.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.product}">
        </div>
        <div class="cart-item-info">
          <h4>${item.product}</h4>
          <p class="cart-item-size">${item.size}</p>
          <p class="cart-item-price">${item.price.toFixed(2)} € <span class="cart-item-qty">x${item.quantity}</span></p>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-selector">
            <button class="qty-btn qty-minus" data-index="${index}" type="button" title="Menge reduzieren">−</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn qty-plus" data-index="${index}" type="button" title="Menge erhöhen">+</button>
          </div>
          <button class="cart-item-remove" data-index="${index}" type="button" title="Entfernen">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `).join('');

    // Add event listeners to quantity buttons
    document.querySelectorAll('.qty-minus').forEach(button => {
      button.addEventListener('click', function() {
        decreaseQuantity(parseInt(this.dataset.index));
      });
    });

    document.querySelectorAll('.qty-plus').forEach(button => {
      button.addEventListener('click', function() {
        increaseQuantity(parseInt(this.dataset.index));
      });
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.cart-item-remove').forEach(button => {
      button.addEventListener('click', function() {
        removeFromCart(parseInt(this.dataset.index));
      });
    });
  }
}

// Function to increase quantity
function increaseQuantity(index) {
  const item = cartItems[index];
  item.quantity++;
  cartTotal += item.price;
  cartCount++;

  cartCountElement.textContent = cartCount;
  document.getElementById('cartTotal').textContent = cartTotal.toFixed(2) + ' €';

  renderCartItems();
}

// Function to decrease quantity
function decreaseQuantity(index) {
  const item = cartItems[index];
  if (item.quantity > 1) {
    item.quantity--;
    cartTotal -= item.price;
    cartCount--;

    cartCountElement.textContent = cartCount;
    document.getElementById('cartTotal').textContent = cartTotal.toFixed(2) + ' €';

    renderCartItems();
  } else {
    removeFromCart(index);
  }
}

// Function to remove item from cart
function removeFromCart(index) {
  const item = cartItems[index];
  cartTotal -= item.price * item.quantity;
  cartCount -= item.quantity;

  cartItems.splice(index, 1);

  cartCountElement.textContent = cartCount;
  document.getElementById('cartTotal').textContent = cartTotal.toFixed(2) + ' €';

  renderCartItems();
}

// Add to cart
addToCartButtons.forEach(button => {
  button.addEventListener('click', function () {
    const product = this.dataset.product;
    const size = this.dataset.size;
    const price = parseFloat(this.dataset.price);
    
    // Get the image source from the product card
    const productCard = this.closest('.product-card');
    const imageElement = productCard.querySelector('.product-image-content');
    const imageSrc = imageElement ? imageElement.src : '';

    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.product === product && item.size === size);

    if (existingItem) {
      // Increase quantity if item exists
      existingItem.quantity++;
    } else {
      // Add new item if it doesn't exist
      cartItems.push({
        product: product,
        size: size,
        price: price,
        quantity: 1,
        image: imageSrc
      });
    }

    cartCount++;
    cartTotal += price;

    cartCountElement.textContent = cartCount;
    document.getElementById('cartTotal').textContent = cartTotal.toFixed(2) + ' €';

    // Render updated cart items
    renderCartItems();

    // Visual feedback
    this.innerHTML = '<i class="fas fa-check"></i> Hinzugefügt!';
    this.style.background = 'var(--primary)';
    this.style.color = 'var(--dark)';

    setTimeout(() => {
      this.innerHTML = '<i class="fas fa-shopping-cart"></i> In den Warenkorb';
      this.style.background = '';
      this.style.color = '';
    }, 1500);

    // Show cart
    cartSidebar.classList.add('active');
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});
