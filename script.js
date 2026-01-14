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

// Load templates from separate file
async function loadTemplates() {
  try {
    const response = await fetch('./templates/shopping-cart.html');
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Inject templates into the main document
    const templates = doc.querySelectorAll('template');
    templates.forEach(template => {
      document.body.appendChild(template.cloneNode(true));
    });
  } catch (error) {
    console.error('Failed to load templates:', error);
  }
}

// Load templates when DOM is ready
loadTemplates();

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
    // Clone and render empty cart template
    const emptyTemplate = document.getElementById('cartEmptyTemplate');
    const emptyContent = emptyTemplate.content.cloneNode(true);
    cartItemsContainer.innerHTML = '';
    cartItemsContainer.appendChild(emptyContent);
  } else {
    // Clear container
    cartItemsContainer.innerHTML = '';
    
    // Render each cart item using template
    const itemTemplate = document.getElementById('cartItemTemplate');
    cartItems.forEach((item, index) => {
      const itemContent = itemTemplate.content.cloneNode(true);
      
      // Fill in template values
      itemContent.querySelector('.item-image').src = item.image;
      itemContent.querySelector('.item-image').alt = item.product;
      itemContent.querySelector('.item-product').textContent = item.product;
      itemContent.querySelector('.item-size').textContent = item.size;
      itemContent.querySelector('.item-price').textContent = item.price.toFixed(2);
      itemContent.querySelector('.item-qty').textContent = `x${item.quantity}`;
      itemContent.querySelector('.item-quantity').textContent = item.quantity;
      
      // Add event listeners
      const qtyMinusBtn = itemContent.querySelector('.qty-minus');
      const qtyPlusBtn = itemContent.querySelector('.qty-plus');
      const removeBtn = itemContent.querySelector('.cart-item-remove');
      
      qtyMinusBtn.dataset.index = index;
      qtyPlusBtn.dataset.index = index;
      removeBtn.dataset.index = index;
      
      qtyMinusBtn.addEventListener('click', function() {
        decreaseQuantity(parseInt(this.dataset.index));
      });
      
      qtyPlusBtn.addEventListener('click', function() {
        increaseQuantity(parseInt(this.dataset.index));
      });
      
      removeBtn.addEventListener('click', function() {
        removeFromCart(parseInt(this.dataset.index));
      });
      
      cartItemsContainer.appendChild(itemContent);
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
